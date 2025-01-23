import { handleGoogleSignIn } from '../../../services/users/auth/googleAuthService.mjs';

export async function googleAuthController(req, res) {
  try {
    // Extract `authCode` and `codeVerifier` from the request body
    const { authCode, codeVerifier } = req.body;

    // Validate input
    if (!authCode || !codeVerifier) {
      console.error('[googleAuthController] Missing authCode or codeVerifier.');
      return res.status(400).json({ message: 'authCode and codeVerifier are required.' });
    }

    console.log(
      '[googleAuthController] Received request:',
      `Auth Code: ${authCode}, Code Verifier: ${codeVerifier}`
    );

    // Call the Google Sign-In service with the provided tokens
    const user = await handleGoogleSignIn({ authCode, codeVerifier });

    if (!user) {
      console.error('[googleAuthController] User data not found.');
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Log the returned user for debugging purposes
    console.log('[googleAuthController] Returning user:', user);

    // Send the authenticated user data back to the client
    return res.status(200).json({ user });
  } catch (error) {
    console.error('[googleAuthController] Error:', error.message || error);

    // Send an appropriate error response
    return res.status(500).json({
      message: 'Internal server error. Please try again later.',
      error: error.message || 'Unknown error.',
    });
  }
}





  