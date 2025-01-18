import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';


GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.webClientId,
  scopes: ['openid', 'email', 'profile'],
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: Constants.expoConfig?.extra?.iosClientId,
});

export default function HomeScreen() {
  const router = useRouter();
  const handleGoogleAuth = async () => {
    // Implement your Google sign-in logic here
    console.log('Google sign-in triggered');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Plateful</Text>

      {/* Official Google Sign-In Button */}
      <GoogleSigninButton
        style={styles.googleSigninButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleAuth}
        disabled={false} // Adjust this dynamically based on your app's logic
      />

      {/* Facebook Sign-In (placeholder) */}
      <TouchableOpacity
        onPress={() => console.log('Facebook sign-in triggered')}
        style={styles.facebookButton}
      >
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </TouchableOpacity>

      {/* Apple Sign-In (placeholder) */}
      <TouchableOpacity
        onPress={() => console.log('Apple sign-in triggered')}
        style={styles.appleButton}
      >
        <Text style={styles.buttonText}>Sign in with Apple</Text>
      </TouchableOpacity>

      {/* Regular Sign-In */}
      <TouchableOpacity
        onPress={() => console.log('Regular sign-in triggered')}
        style={styles.signInButton}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Regular Sign-Up */}
      <TouchableOpacity
        onPress={() => console.log('Regular sign-up triggered')}
        style={styles.signUpButton}
      >
        <Text style={styles.linkText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Example styles:
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  googleSigninButton: { width: 192, height: 48, marginBottom: 20 }, // Dimensions for Google button
  facebookButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  signUpButton: { marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#007AFF', fontSize: 16, textDecorationLine: 'underline' },
});
