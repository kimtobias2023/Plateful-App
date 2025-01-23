import React, { useEffect } from "react";
import { Text } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useSession } from "./../ctx";

export default function AppLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/oauthredirect"); // Redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}



