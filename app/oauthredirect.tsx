import React, { useCallback, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '@store';
import { useRouter } from 'expo-router'; 
import debounce from 'lodash.debounce';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { signInWithGoogle } from '@userAuthSlice'; // Import your thunk

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter(); 
  const [signInInProgress, setSignInInProgress] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || '',
    scopes: ['openid', 'email', 'profile'],
    responseType: 'code',
    usePKCE: true,
  });

  const handleGoogleSignInInternal = async () => {
    if (signInInProgress) return;

    if (!request) {
      Alert.alert('Error', 'Google sign-in is not configured correctly.');
      return;
    }

    setSignInInProgress(true);

    try {
      const result = await promptAsync();

      if (result.type === 'success') {
        const authCode = result.params?.code;
        const codeVerifier = request.codeVerifier;

        if (authCode && codeVerifier) {
          console.log('[HomeScreen] Authorization Code:', authCode);
          console.log('[HomeScreen] Code Verifier:', codeVerifier);

          // Dispatch the thunk to handle token exchange and state updates
          const resultAction = await dispatch(signInWithGoogle({ authCode, codeVerifier }));

          if (signInWithGoogle.fulfilled.match(resultAction)) {
            console.log('[HomeScreen] Google sign-in completed successfully.');
            router.replace('/(app)'); // Replace with the path to your dashboard
          } else {
            Alert.alert('Error', resultAction.payload || 'Sign-in failed.');
          }
        } else {
          Alert.alert('Error', 'Failed to retrieve authorization code or code verifier.');
        }
      } else {
        Alert.alert('Error', 'Sign-in was canceled or failed.');
      }
    } catch (error) {
      console.error('[HomeScreen] Sign-in Error:', error);
      Alert.alert('Error', 'An error occurred during sign-in.');
    } finally {
      setSignInInProgress(false);
    }
  };

  const debouncedHandleGoogleSignIn = useCallback(
    debounce(handleGoogleSignInInternal, 300, { leading: true, trailing: false }),
    [signInInProgress, request]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={debouncedHandleGoogleSignIn}
        style={[styles.button, signInInProgress && styles.buttonDisabled]}
        disabled={signInInProgress}
      >
        <Text style={styles.buttonText}>
          {signInInProgress ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    padding: 16,
    backgroundColor: '#4285F4',
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
