import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "store/slices/authSlice"; // Adjust path
import { RootState, AppDispatch } from "@store"; // Adjust path

const VerifyEmail: React.FC = () => {
  // 1. Retrieve token from URL params
  const params = useLocalSearchParams();
  const token = params?.token as string | undefined;

  // 2. Setup router and dispatch
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 3. Extract state from Redux
  const { isLoading, verificationMessage, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isVerified, setIsVerified] = useState(false);

  // 4. Debug log
  useEffect(() => {
    console.log("Frontend logging: Token from URL params:", token);
  }, [token]);

  const handlePress = () => {
    // Log the token to verify its value
    console.log("Token being used in handlePress:", token);
  
    if (token) {
      dispatch(verifyEmail({ token }))
        .unwrap()
        .then((message) => {
          console.log("Frontend: Verification succeeded:", message);
          setIsVerified(true);
          router.push("/login"); // Navigate on success
        })
        .catch((err) => {
          console.error("Error caught in handlePress:", err);
          Alert.alert("Retry Failed", err?.toString() || "Unexpected error occurred.");
        });
    } else {
      Alert.alert("Error", "Token is missing.");
    }
  };
  
  // 7. Render UI
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {isVerified
              ? "Email successfully verified. You can now proceed to login."
              : verificationMessage || error || "An unexpected error occurred."}
          </Text>
          <Button
            title={isVerified ? "Go to Login" : !error ? "Verify Email" : "Retry"}
            onPress={handlePress}
            color={!error ? "#007BFF" : "#FF0000"}
          />
        </View>
      )}
    </View>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  messageContainer: {
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});






