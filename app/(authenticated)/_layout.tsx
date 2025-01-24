import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useSession } from "../ctx";
import { Header } from "@components/Header";
import { useAppDispatch, useAppSelector } from "@store";
import { checkSubscriptionStatusThunk, selectSubscriptionStatus } from "@subscriptionSlice";

export default function AuthenticatedLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useSession();

  const { isSubscribed, isCheckingSubscription } = useAppSelector(selectSubscriptionStatus);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/oauthredirect");
      } else {
        dispatch(checkSubscriptionStatusThunk());
      }
    }
  }, [isAuthenticated, isLoading, dispatch, router]);

  useEffect(() => {
    if (!isLoading && !isCheckingSubscription) {
      if (isAuthenticated) {
        if (isSubscribed) {
          router.replace("/(authenticated)");
        } else {
          router.replace("/subscription");
        }
      }
    }
  }, [isAuthenticated, isLoading, isSubscribed, isCheckingSubscription, router]);

  if (isLoading || isCheckingSubscription) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
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

