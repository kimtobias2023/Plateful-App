import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export default function OAuthRedirect() {
  const router = useRouter();
  const { code } = useGlobalSearchParams(); // Only code, not codeVerifier

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        if (!code) {
          throw new Error('Authorization code not found in redirect URI.');
        }

        console.log('[OAuthRedirect] Authorization Code:', code);

        // Retrieve the codeVerifier from SecureStore
        const codeVerifier = await SecureStore.getItemAsync('temp_code_verifier');
        console.log('[OAuthRedirect] Retrieved codeVerifier from SecureStore:', codeVerifier);

        if (!codeVerifier) {
          throw new Error('Code verifier not found in secure storage.');
        }

        // Exchange authorization code for tokens
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: code as string,
            client_id:
              Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID ||
              Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID ||
              '',
            redirect_uri: Constants.expoConfig?.extra?.GOOGLE_REDIRECT_URI || '',
            grant_type: 'authorization_code',
            code_verifier: codeVerifier,
          }).toString(),
        });

        const tokens = await response.json();

        if (!response.ok || !tokens.access_token) {
          console.error('[OAuthRedirect] Token Exchange Error:', tokens);
          throw new Error(tokens.error_description || 'Failed to exchange authorization code.');
        }

        console.log('[OAuthRedirect] Tokens received:', tokens);

        // Save tokens securely
        await SecureStore.setItemAsync('access_token', tokens.access_token);
        await SecureStore.setItemAsync('id_token', tokens.id_token);
        if (tokens.refresh_token) {
          await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
        }

        console.log('[OAuthRedirect] Tokens saved successfully.');

        // Navigate to the dashboard
        router.replace('/(authenticated)/dashboard');
      } catch (error) {
        console.error('[OAuthRedirect] OAuth Redirect Error:', error);

        Alert.alert(
          'Error',
          error instanceof Error ? error.message : 'Failed to complete sign-in. Please try again.'
        );
        router.replace('/login');
      }
    };

    handleOAuthRedirect();
  }, [code, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Completing sign-in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  text: {
    marginTop: 16, fontSize: 16, color: '#333',
  },
});

