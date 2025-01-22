import React, { useCallback, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash.debounce';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { setQueuedItem } from '@utils/secureStoreUtils'; /

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signInInProgress, setSignInInProgress] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID || '',
    scopes: ['openid', 'email', 'profile'],
    responseType: 'code',
    usePKCE: true,
  });

  // This function will handle the sign-in logic
  const handleGoogleSignInInternal = async () => {
    if (signInInProgress) {
      console.log('[HomeScreen] Sign-in already in progress.');
      return;
    }

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

          // Option 1: Directly navigate
          // Stash codeVerifier in SecureStore or Redux, then navigate:
          await setQueuedItem('temp_code_verifier', codeVerifier);
          router.push(`/oauthredirect?code=${encodeURIComponent(authCode)}`);

          // OR

          // Option 2: Dispatch a Redux thunk that handles everything
          // dispatch(signInWithGoogle({ authCode, codeVerifier }));
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

  // Use lodash.debounce to wrap the handler
  // The "300" can be adjusted as needed (milliseconds)
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


