import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@store"; // Redux store type
import { MaterialIcons } from "@expo/vector-icons";

export default function AuthenticatedLayout() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null; // Show a loading state if needed

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="web"
        options={{
          title: "Web",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="public" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}


