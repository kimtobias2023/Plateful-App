import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadMedia, updateMedia, deleteMedia } from "@mediaSlice";
import { updateBio } from "@userProfileSlice";
import { RootState, AppDispatch } from "@store";

interface ProfileScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  // User and media from Redux
  const user = useSelector((state: RootState) => state.user.user);
  const mediaItems = useSelector((state: RootState) => state.media.mediaItems);

  // Filter out the user's profile images
  const profileImages = mediaItems.filter((m) => m.mediaLabel === "profile_img");

  // Local state for bio
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [initialBio, setInitialBio] = useState<string>(user?.bio || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // If user data changes in Redux, sync local bio states
    setInitialBio(user?.bio || "");
    setBio(user?.bio || "");
  }, [user]);

  // ---------------------------
  //         NAVIGATION
  // ---------------------------
  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName);
  };

  // ---------------------------
  //        BIO HANDLING
  // ---------------------------
  const handleBioSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError("");

    dispatch(updateBio({ userId: user.id, bio }))
      .unwrap()
      .then(() => {
        setInitialBio(bio);
        Alert.alert("Success", "Bio updated successfully!");
      })
      .catch((err: any) => {
        setError(err.message || "Failed to update bio.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ---------------------------
  //     IMAGE PICK + UPLOAD
  // ---------------------------
  const pickImage = async (): Promise<File | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return {
        uri: result.assets[0].uri,
        name: "profile_upload.jpg",
        type: "image/jpeg",
      };
    }
    return null;
  };

  const handleUploadMedia = async () => {
    if (!user?.id) return;

    try {
      const file = await pickImage();
      if (file) {
        setIsLoading(true);
        dispatch(uploadMedia({ userId: user.id, file, mediaLabel: "profile_img" }))
          .unwrap()
          .then(() => {
            Alert.alert("Success", "Profile photo uploaded successfully!");
          })
          .catch((err: any) => {
            setError(err.message || "Failed to upload media.");
          })
          .finally(() => setIsLoading(false));
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick and upload media.");
    }
  };

  const handleUpdateMedia = async (mediaId: number) => {
    if (!user?.id || !mediaId) return;

    try {
      const file = await pickImage();
      if (file) {
        setIsLoading(true);
        dispatch(updateMedia({ mediaId, mediaLabel: "profile_img", file }))
          .unwrap()
          .then(() => {
            Alert.alert("Success", "Profile photo updated successfully!");
          })
          .catch((err: any) => {
            setError(err.message || "Failed to update media.");
          })
          .finally(() => setIsLoading(false));
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick and update media.");
    }
  };

  const handleRemovePhoto = async (mediaId: number) => {
    if (!user?.id || !mediaId) {
      setError("No photo to remove.");
      return;
    }
    setIsLoading(true);
    dispatch(deleteMedia({ userId: user.id, mediaId, mediaLabel: "profile_img" }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Photo removed successfully!");
      })
      .catch((err: any) => {
        setError(err.message || "Failed to remove photo.");
      })
      .finally(() => setIsLoading(false));
  };

  // ---------------------------
  //         RENDER
  // ---------------------------
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => handleNavigate("Home")}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("Recipes")}>
          <Text style={styles.navLink}>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("Groceries")}>
          <Text style={styles.navLink}>Groceries</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content: Scrollable */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Profile Photo */}
        <View style={styles.profileImageContainer}>
          {profileImages.length > 0 ? (
            <>
              <Image source={{ uri: profileImages[0].fullUrl }} style={styles.profileImage} />
              <View style={styles.profileImageButtons}>
                <TouchableOpacity
                  style={[styles.imageButton, { marginRight: 10 }]}
                  onPress={() => handleUpdateMedia(profileImages[0].id)}
                >
                  <Text style={styles.imageButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => handleRemovePhoto(profileImages[0].id)}
                >
                  <Text style={styles.imageButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity style={styles.imageButton} onPress={handleUploadMedia}>
              <Text style={styles.imageButtonText}>Upload Profile Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bio Section */}
        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            multiline
            placeholder="Write a brief bio..."
            value={bio}
            onChangeText={(text) => setBio(text)}
          />
          <TouchableOpacity
            style={[styles.saveButton, bio === initialBio ? styles.disabledButton : null]}
            disabled={bio === initialBio || isLoading}
            onPress={handleBioSave}
          >
            <Text style={styles.saveButtonText}>
              {bio === initialBio ? "Bio Saved" : "Save Bio"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error or Loading */}
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        {isLoading ? <Text style={styles.loadingMessage}>Loading...</Text> : null}

        {/* Additional Navigation */}
        <View style={styles.footerNav}>
          <TouchableOpacity
            style={styles.footerNavButton}
            onPress={() => handleNavigate("ScrapeRecipe")}
          >
            <Text style={styles.footerNavButtonText}>Upload Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerNavButton}
            onPress={() => handleNavigate("ProfileSettings")}
          >
            <Text style={styles.footerNavButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// ---------------------------
//        STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#eaeaea",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navLink: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  sidebar: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  sidebarLink: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  mainContent: {
    alignItems: "center",
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileImageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  bioContainer: {
    width: "100%",
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  loadingMessage: {
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  footerNav: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
  },
  footerNavButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  footerNavButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProfileScreen;