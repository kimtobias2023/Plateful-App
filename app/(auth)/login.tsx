import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { login } from "@userAuthSlice"; // Redux actions
import { AppDispatch, RootState } from "@store"; // Ensure you have these types

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const isEmailValid = (email: string): boolean =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const isPasswordValid = (password: string): boolean => password.length >= 6;

  const handleLoginError = (errorMessage: string): void => {
    setMessage(errorMessage);
  };

  const handleSubmit = async (): Promise<void> => {
    setMessage("");

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      handleLoginError("Invalid email or password.");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      router.replace("/dashboard"); // Redirect to dashboard upon successful login
    } catch (error: any) {
      console.error("Login error:", error);
      handleLoginError(error.message || "An error occurred during login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Display error message */}
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/signup")}
        >
          Sign Up
        </Text>
      </Text>
      <Text style={styles.footerText}>
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          Forgot password?
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  showPasswordButton: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  showPasswordText: {
    color: "#007BFF",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorMessage: {
    color: "#FF0000",
    marginBottom: 15,
    textAlign: "center",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;



