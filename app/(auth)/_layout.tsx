import { Stack, useRouter } from "expo-router";
import React from "react";
import { useSession } from "../ctx";

const AuthLayout: React.FC = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Signup",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: "Reset Password",
        }}
      />
      <Stack.Screen
        name="verify-email-pending"
        options={{
          title: "Verify Email Pending",
        }}
      />
      <Stack.Screen
        name="verify-email/[token]"
        options={{
          title: "Verify Email",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
