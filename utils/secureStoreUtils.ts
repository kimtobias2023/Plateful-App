import * as SecureStore from 'expo-secure-store';

// Save state to SecureStore
export const saveStateToSecureStore = async (key: string, state: any) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving state to SecureStore for key "${key}":`, error);
  }
};

// Load state from SecureStore
export const loadStateFromSecureStore = async (key: string) => {
  try {
    const state = await SecureStore.getItemAsync(key);
    return state ? JSON.parse(state) : undefined;
  } catch (error) {
    console.error(`Error loading state from SecureStore for key "${key}":`, error);
    return undefined;
  }
};
