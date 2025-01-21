import React from 'react';
import { Slot } from 'expo-router';
import { SessionProvider } from './ctx';
import { Provider } from 'react-redux';
import { store } from '@store';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <React.StrictMode>
      <SessionProvider>
        <Provider store={store}>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
        </Provider>
      </SessionProvider>
    </React.StrictMode>
  );
}









