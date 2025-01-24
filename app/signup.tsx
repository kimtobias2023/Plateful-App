import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store"; // Adjust path to Redux store
import { signup } from "store/slices/authSlice";
import { useRouter } from "expo-router";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const signupSuccess = useSelector((state: RootState) => state.auth.signupSuccess);

  // Navigate to verification pending screen on signup success
  useEffect(() => {
    if (signupSuccess) {
      router.push("/verify-email-pending");
    }
  }, [signupSuccess]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    if (formData.password && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    // Password strength validation
    if (formData.password) {
      const password = formData.password;

      if (!/(?=.*[A-Z])/.test(password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
      } else if (!/(?=.*[a-z])/.test(password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
      } else if (!/(?=.*\d)/.test(password)) {
        newErrors.password = "Password must contain at least one number.";
      } else if (!/(?=.*[@$!%*?&#])/.test(password)) {
        newErrors.password =
          "Password must contain at least one special character (@$!%*?&).";
      } else if (!/^.{8,}$/.test(password)) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return; // Prevent multiple submissions
  
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before submitting.");
      return;
    }
  
    setIsSubmitting(true); // Set submission state
    setErrors({}); // Clear previous errors
  
    try {
      console.log("FormData before submission:", formData);
  
      // Dispatch signup action
      await dispatch(signup(formData)).unwrap();
  
      // Navigate directly to the verification pending screen
      router.push("/verify-email-pending");
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Error",
        error?.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* First Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(value) => setFormData({ ...formData, firstName: value })}
          autoComplete="given-name"
        />
      </View>
      {errors.firstName ? <Text style={styles.error}>{errors.firstName}</Text> : null}


      {/* Last Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(value) => setFormData({ ...formData, lastName: value })}
          autoComplete="family-name"
        />
      </View>
      {errors.lastName ? <Text style={styles.error}>{errors.lastName}</Text> : null}


      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => setFormData({ ...formData, email: value })}
          autoComplete="email"
        />
      </View>
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}


      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(value) => setFormData({ ...formData, password: value })}
          autoComplete="password"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirmPassword}
          onChangeText={(value) =>
            setFormData({ ...formData, confirmPassword: value })
          }
          autoComplete="password-new"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}


      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isSubmitting && { backgroundColor: "#aaa" }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 12,
    color: "#000",
    backgroundColor: "transparent",
  },
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default SignupScreen;




