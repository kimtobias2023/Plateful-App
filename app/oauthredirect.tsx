import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { fetchGoogleUser } from '@userAuthSlice';
import { AppDispatch } from '@store'; // Adjust the path to your store file

export default function OAuthRedirect() {
  const router = useRouter();
  const { code, codeVerifier } = useGlobalSearchParams(); // Retrieve `authCode` and `codeVerifier` from query params
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        if (!code || !codeVerifier) {
          throw new Error('Authorization code or code verifier not found in redirect URI.');
        }

        console.log('Authorization Code:', code);
        console.log('Code Verifier:', codeVerifier);

        // Dispatch the Redux thunk to handle session management
        await dispatch(fetchGoogleUser({ authCode: code as string, codeVerifier: codeVerifier as string })).unwrap();

        // Redirect to the dashboard or another screen
        router.replace('/dashboard');
      } catch (error) {
        console.error('OAuth Redirect Error:', error);

        if (typeof error === 'string') {
          Alert.alert('Error', error);
        } else if (error instanceof Error) {
          Alert.alert('Error', error.message || 'Failed to complete sign-in.');
        } else {
          Alert.alert('Error', 'Failed to complete sign-in. Please try again.');
        }

        router.replace('/login'); // Redirect to login if something goes wrong
      }
    };

    handleOAuthRedirect();
  }, [code, codeVerifier, dispatch, router]);


  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4285F4" />
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
    color: '#666',
  },
});

