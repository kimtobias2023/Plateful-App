import React, { useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useSession } from './ctx';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const HomeScreen: React.FC = () => {
  const { signIn } = useSession();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID ?? '',
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID ?? '',
    scopes: ['openid', 'email', 'profile'],
    responseType: 'code',
    usePKCE: true,
  });

  useEffect(() => {
    if (request?.codeChallenge) {
      console.log('[HomeScreen] Code Challenge:', request.codeChallenge);
    } else {
      console.log('[HomeScreen] Code Challenge is not available yet.');
    }
  }, [request]);

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Error', 'Google sign-in is not configured correctly.');
      return;
    }

    // Remove any old codeVerifier from previous sessions
    await SecureStore.deleteItemAsync('temp_code_verifier');

    // Begin sign-in
    const result = await promptAsync();

    if (result.type === 'success') {
      const authCode = result.params.code;
      const codeVerifier = request.codeVerifier; // Retrieve the codeVerifier from expo-auth-session

      if (authCode && codeVerifier) {
        console.log('[HomeScreen] Authorization Code:', authCode);
        console.log('[HomeScreen] Storing codeVerifier:', codeVerifier);

        // Securely store the new codeVerifier
        await SecureStore.setItemAsync('temp_code_verifier', codeVerifier);

        // Navigate with only authCode
        router.push(`/oauthredirect?code=${encodeURIComponent(authCode)}`);
      } else {
        Alert.alert('Error', 'Failed to retrieve authorization code or code verifier.');
      }
    } else {
      Alert.alert('Error', 'Sign-in was canceled or failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
  button: {
    padding: 15, backgroundColor: '#4285F4', borderRadius: 5,
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold',
  },
});
