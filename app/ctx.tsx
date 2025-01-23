import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { setQueuedItem, getQueuedItem } from '@utils/secureStoreUtils'; 

interface SessionContextValue {
  codeVerifier?: string;
  setCodeVerifier: (cv: string) => void;

  accessToken?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadTokensFromSecureStore: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [codeVerifier, setCodeVerifier] = useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * signIn: store an access token in both SecureStore (queued) and memory
   */
  async function signIn(token: string) {
    await setQueuedItem('access_token', token);
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
   * loadTokensFromSecureStore: read from secure store on app startup
   */
  async function loadTokensFromSecureStore() {
    const storedToken = await getQueuedItem('access_token');
    setAccessToken(storedToken ?? undefined);
  }

  /**
   * Initialize tokens on app startup
   */
  useEffect(() => {
    async function initialize() {
      await loadTokensFromSecureStore();
      setIsLoading(false);
    }
    initialize();
  }, []);

  const value: SessionContextValue = {
    codeVerifier,
    setCodeVerifier,

    accessToken,
    isAuthenticated: !!accessToken, // Derived value
    isLoading,
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

