import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../../../models/users/basic-profile/User.mjs';
import Role from '../../../models/users/auth/Role.mjs';

// Initialize OAuth2Client
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_WEB_CLIENT_ID,
});

export async function handleGoogleSignIn({ authCode, codeVerifier }) {
  try {
    let payload;
    let refreshToken;

    if (authCode && codeVerifier) {
      console.log('[handleGoogleSignIn] Starting token exchange with PKCE...');

      try {
        // Log the details being sent to Google
        console.log('[handleGoogleSignIn] Exchanging authCode for tokens with:', {
          code: authCode,
          codeVerifier,
          redirect_uri: process.env.GOOGLE_WEB_REDIRECT_URI,
          client_id: process.env.GOOGLE_WEB_CLIENT_ID,
          client_secret: process.env.GOOGLE_WEB_CLIENT_SECRET,
        });

        // Token exchange with PKCE
        const { tokens } = await client.getToken({
          code: authCode,
          redirect_uri: process.env.GOOGLE_WEB_REDIRECT_URI,
          client_id: process.env.GOOGLE_WEB_CLIENT_ID,
          client_secret: process.env.GOOGLE_WEB_CLIENT_SECRET,
          code_verifier: codeVerifier,
        });

        if (!tokens || !tokens.id_token) {
          console.error('[handleGoogleSignIn] No tokens received from token exchange.');
          throw new Error('Failed to retrieve ID token from authCode exchange.');
        }

        refreshToken = tokens.refresh_token;

        console.log('[handleGoogleSignIn] Tokens received:', tokens);

        // Verify ID token to extract payload
        console.log('[handleGoogleSignIn] Verifying ID token...');
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        payload = ticket.getPayload();
        if (!payload) {
          console.error('[handleGoogleSignIn] Invalid ID token payload.');
          throw new Error('Invalid ID token payload.');
        }

        console.log('[handleGoogleSignIn] ID token verified successfully:', payload);
      } catch (error) {
        // Detailed logging for token exchange errors
        console.error('[handleGoogleSignIn] Token Exchange Error:', {
          error: error.response?.data || error.message || error,
          codeVerifier,
          authCode,
        });
        throw new Error('Failed to exchange authCode for tokens.');
      }
    } else {
      console.error('[handleGoogleSignIn] Missing authCode or codeVerifier.');
      throw new Error('authCode and codeVerifier are required.');
    }

    // Extract user data from payload
    console.log('[handleGoogleSignIn] Extracting user data from token payload...');
    const { email, given_name, family_name, sub } = payload;

    if (!email) {
      throw new Error('Email is required in the token payload.');
    }

    // Check if the user exists in the database
    let user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('[handleGoogleSignIn] User not found. Creating new user...');
      const userRole = await Role.findOne({ where: { name: 'User' } });
      if (!userRole) {
        throw new Error('User role not found in the database.');
      }

      // Optionally generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        firstName: given_name ?? '',
        lastName: family_name ?? '',
        email,
        roleId: userRole.id,
        googleId: sub, // Unique Google user ID
        refreshToken, // Save the refresh token
        isEmailVerified: true,
        verificationToken,
      });
      console.log('[handleGoogleSignIn] New user created:', user.email);
    } else {
      console.log('[handleGoogleSignIn] Existing user found. Updating details...');
      // Update user details if already exists
      await user.update({
        firstName: given_name || user.firstName,
        lastName: family_name || user.lastName,
        googleId: sub || user.googleId,
        refreshToken: refreshToken || user.refreshToken, // Update the refresh token if available
      });
    }

    console.log('[handleGoogleSignIn] Successfully authenticated user:', email);

    // Return user data
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error('[handleGoogleSignIn] Error:', error.message || error);
    throw new Error(error.message || 'Failed to handle Google Sign-In.');
  }
}








