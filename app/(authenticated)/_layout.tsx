import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useSession } from "../ctx";
import { Header } from "@components/Header"; // Import your Header component

export default function AuthenticatedLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/oauthredirect"); // Redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Add the header */}
      <Header />

      {/* Render the Slot */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});




