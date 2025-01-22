// OAuthRedirect.tsx (revised)
import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { setQueuedItem, getQueuedItem } from '@utils/secureStoreUtils'; // import queue-based helpers

export default function OAuthRedirect() {
  const router = useRouter();
  const { code } = useLocalSearchParams(); // only the code param

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        // 1) Check that we have code
        if (!code) {
          throw new Error('Authorization code not found in redirect URI.');
        }
        console.log('[OAuthRedirect] Authorization Code:', code);

        // 2) Retrieve codeVerifier from secure storage (queued)
        const codeVerifier = await getQueuedItem('temp_code_verifier');
        if (!codeVerifier) {
          throw new Error('No codeVerifier found in SecureStore (queued).');
        }
        console.log('[OAuthRedirect] Retrieved codeVerifier:', codeVerifier);

        // 3) Exchange code + codeVerifier for tokens
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
            codeVerifier,
          }).toString(),
        });

        const tokens = await response.json();
        if (!response.ok || !tokens.access_token) {
          console.error('[OAuthRedirect] Token Exchange Error:', tokens);
          throw new Error(tokens.error_description || 'Failed to exchange auth code for tokens.');
        }

        console.log('[OAuthRedirect] Tokens received:', tokens);

        // 4) Store tokens (using queued approach, if desired)
        // For example, store access token in 'access_token' key
        await setQueuedItem('access_token', tokens.access_token);
        await setQueuedItem('id_token', tokens.id_token);

        if (tokens.refresh_token) {
          await setQueuedItem('refresh_token', tokens.refresh_token);
        }

        console.log('[OAuthRedirect] Tokens saved successfully (queued).');

        // 5) Clean up ephemeral codeVerifier
        await setQueuedItem('temp_code_verifier', null);

        // 6) Redirect user to your next screen
        router.replace('/(authenticated)/dashboard');
      } catch (error) {
        console.error('[OAuthRedirect] Error:', error);
        Alert.alert(
          'Error',
          error instanceof Error ? error.message : 'Failed to complete sign-in.'
        );
        router.replace('/');
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
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});

