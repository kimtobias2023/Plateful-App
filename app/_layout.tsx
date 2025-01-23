import React from 'react';
import { Slot } from 'expo-router';
import { SessionProvider } from './ctx';
import { Provider } from 'react-redux';
import { store } from '@store';

export default function RootLayout() {
  return (
    <React.StrictMode>
      <SessionProvider>
        <Provider store={store}>
          <Slot/>
        </Provider>
      </SessionProvider>
    </React.StrictMode>
  );
}











