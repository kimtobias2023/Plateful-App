import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSession } from "../app/ctx";
import { useRouter } from "expo-router";

export const Header: React.FC = () => {
  const { signOut } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/oauthredirect"); // Redirect to login
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>My App</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#4C51BF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  logoutText: {
    color: "#4C51BF",
    fontWeight: "bold",
  },
});
