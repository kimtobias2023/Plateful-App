import React from "react";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@store"; // Redux store
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </Provider>
    </React.StrictMode>
  );
}








