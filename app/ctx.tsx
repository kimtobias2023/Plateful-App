// ctx.tsx
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { setQueuedItem, getQueuedItem } from '../utils/secureStoreUtils'; 
// the queue-based setItemAsync/getItemAsync

interface SessionContextValue {
  codeVerifier?: string;
  setCodeVerifier: (cv: string) => void;

  accessToken?: string;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadTokensFromSecureStore: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  // Ephemeral PKCE codeVerifier
  const [codeVerifier, setCodeVerifier] = useState<string | undefined>(undefined);

  // Access token stored in memory after we load it from secure store or sign in
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  /**
   * signIn: store an access token in both SecureStore (queued) and memory
   */
  async function signIn(token: string) {
    // 1) Write to secure store, concurrency-safe via queue
    await setQueuedItem('access_token', token);
    // 2) Update in-memory state
    setAccessToken(token);
  }

  /**
   * signOut: remove the access token from secure store & memory
   */
  async function signOut() {
    await setQueuedItem('access_token', null);
    setAccessToken(undefined);
  }

  /**
   * loadTokensFromSecureStore: read from secure store on app startup (or whenever)
   */
  async function loadTokensFromSecureStore() {
    const storedToken = await getQueuedItem('access_token');
    setAccessToken(storedToken ?? undefined);
  }

  const value: SessionContextValue = {
    codeVerifier,
    setCodeVerifier,

    accessToken,
    signIn,
    signOut,
    loadTokensFromSecureStore,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider.');
  }
  return value;
}

export default { useSession, SessionProvider };

