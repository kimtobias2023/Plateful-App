import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['openid', 'email', 'profile'],
    responseType: 'code',
    usePKCE: true, // Enable PKCE
  });

  // Log the codeChallenge (if available)
  React.useEffect(() => {
    if (request?.codeChallenge) {
      console.log('Code Challenge:', request.codeChallenge); // Log the code challenge for debugging
    } else {
      console.log('Code Challenge is not available yet.');
    }
  }, [request]);
  
  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Error', 'Google sign-in is not configured correctly.');
      return;
    }
  
    const result = await promptAsync();
  
    if (result.type === 'success') {
      const authCode = result.params.code;
      const codeVerifier = request.codeVerifier; // Get the codeVerifier
  
      if (authCode && codeVerifier) {
        console.log('Authorization Code:', authCode);
        console.log('Code Verifier:', codeVerifier);
  
        // Add the log for debugging before redirecting
        console.log('Redirecting with:', {
          authCode,
          codeVerifier,
          url: `/oauthredirect?code=${encodeURIComponent(authCode)}&codeVerifier=${encodeURIComponent(codeVerifier)}`,
        });
  
        // Redirect to the OAuthRedirect component with query params
        router.push(`/oauthredirect?code=${encodeURIComponent(authCode)}&codeVerifier=${encodeURIComponent(codeVerifier)}`);
      } else {
        Alert.alert('Error', 'Failed to retrieve authorization code or code verifier.');
      }
    } else {
      Alert.alert('Error', 'Sign-in was canceled or failed.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Plateful</Text>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.signInButton}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


