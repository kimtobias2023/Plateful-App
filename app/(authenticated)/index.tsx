import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/types"; // Adjust the path to your `types.ts` file
import { useNavigation } from "@react-navigation/native";
import { useSession } from "./../ctx";

type ButtonConfig = {
  title: string;
  icon: string;
  iconType: "MaterialCommunityIcons" | "FontAwesome";
  navigateTo: keyof RootStackParamList;
};

const DashboardScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { signOut } = useSession();
  
  const buttons: ButtonConfig[] = [
    {
      title: "Recipes",
      icon: "book",
      iconType: "MaterialCommunityIcons",
      navigateTo: "recipes",
    },
    {
      title: "Menu",
      icon: "food",
      iconType: "MaterialCommunityIcons",
      navigateTo: "menu",
    },
    {
      title: "Web",
      icon: "globe",
      iconType: "FontAwesome",
      navigateTo: "web",
    },
    {
      title: "Profile",
      icon: "user",
      iconType: "FontAwesome",
      navigateTo: "profile",
    },
  ];

  const renderIcon = (iconType: ButtonConfig["iconType"], iconName: string) => {
    switch (iconType) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name="home" size={40} color="#4C51BF" />
        );
      case "FontAwesome":
        return <FontAwesome name="user" size={40} color="#4C51BF" />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    await signOut(); // Clear session
    navigation.reset({
      index: 0,
      routes: [{ name: 'oauthredirect' }], // Reset navigation stack
    });
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Message */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to Your Dashboard!</Text>
        <Text style={styles.subheader}>Explore your options below:</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(button.navigateTo)}
          >
            {renderIcon(button.iconType, button.icon)}
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4C51BF",
  },
  subheader: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  card: {
    width: "40%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
});

export default DashboardScreen;

