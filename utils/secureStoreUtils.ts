// secureStoreUtils.ts
import * as SecureStore from 'expo-secure-store';
import { addSecureStoreOperation } from './secureStoreQueue';

export function setQueuedItem(key: string, value: string | null): Promise<void> {
  return addSecureStoreOperation<void>(async () => {
    if (value === null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  });
}

export function getQueuedItem(key: string): Promise<string | null> {
  return addSecureStoreOperation<string | null>(async () => {
    const val = await SecureStore.getItemAsync(key);
    return val; // Return the read value
  });
}

