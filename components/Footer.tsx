import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSession } from "../app/ctx";
import { useRouter } from "expo-router";

export const Footer: React.FC = () => {
  const { signOut } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login"); // Redirect to login
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: "#4C51BF",
    alignItems: "center",
    justifyContent: "center",
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
