import * as Crypto from 'expo-crypto';

// Function to generate a random string for the code verifier
export function generateRandomString(length: number): string {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to create a code verifier and its corresponding code challenge
export async function createCodeVerifierAndChallenge() {
  const codeVerifier = generateRandomString(64); // Minimum length: 43, Maximum length: 128
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  // Base64URL encode the digest
  const codeChallenge = digest
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=/g, '');  // Remove '=' padding

  return { codeVerifier, codeChallenge };
}



