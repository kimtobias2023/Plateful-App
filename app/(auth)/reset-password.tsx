import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ResetPasswordScreen(): JSX.Element {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>(); // Token from URL params
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    return password.length >= minLength;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      // Mock API request (replace with actual API call)
      const response = await new Promise<{ status: number }>((resolve) =>
        setTimeout(() => resolve({ status: 200 }), 2000)
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password has been reset successfully.");
        router.push("/(auth)/login"); // Navigate to Login screen
      } else {
        setMessage("Password reset failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during password reset:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="New password"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        accessibilityLabel="Confirm new password"
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.link}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#a3c9ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
  navLinks: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  link: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

