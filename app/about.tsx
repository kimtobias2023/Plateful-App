import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

/**
 * AboutScreen
 *
 * A lively, scrollable "About" page introducing the meal-planning app's features.
 * Includes images, vibrant colors, and a quick summary of the best parts of the app.
 */
const AboutScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero / Header Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x200.png?text=Meal+Planning+Hero' }}
          style={styles.heroImage}
        />
        <Text style={styles.heroText}>Meal Planning App</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>About Our Meal Planning App</Text>

      {/* Intro Description */}
      <Text style={styles.description}>
        Welcome to your ultimate companion for meal planning! Here’s just a taste of what 
        you can do:
      </Text>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60.png?text=Scrape' }}
            style={styles.featureIcon}
          />
          <Text style={styles.listItem}>
            <Text style={styles.featureBold}>Scrape Recipes: </Text>
            Don’t see your favorites here? Quickly fetch them from the web and save them for easy re-use. 
            (We don’t provide recipes by default—you bring the goodies!)
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60.png?text=D%26D' }}
            style={styles.featureIcon}
          />
          <Text style={styles.listItem}>
            <Text style={styles.featureBold}>Easy Drag & Drop: </Text>
            Schedule meals in seconds. Visual meal planning reduces time and stress.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60.png?text=UI' }}
            style={styles.featureIcon}
          />
          <Text style={styles.listItem}>
            <Text style={styles.featureBold}>Intuitive UI: </Text>
            Our layout and design keep it simple. No messy interfaces—just easy navigation.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60.png?text=Voice' }}
            style={styles.featureIcon}
          />
          <Text style={styles.listItem}>
            <Text style={styles.featureBold}>Voice Feature: </Text>
            Too busy chopping veggies? Have recipes read aloud while you cook!
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60.png?text=World' }}
            style={styles.featureIcon}
          />
          <Text style={styles.listItem}>
            <Text style={styles.featureBold}>Endless Possibilities: </Text>
            Pull recipes from anywhere on the internet. Keep them saved for future feasts!
          </Text>
        </View>
      </View>

      {/* Closing / Footer */}
      <Text style={styles.footer}>
        Hungry yet? With our meal-planning app, you can organize your recipes,
        schedule your week, and eat like a pro. Ready to get started?
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCF3CF', // Warm pastel background
    padding: 16,
    alignItems: 'stretch',
  },
  heroSection: {
    backgroundColor: '#F7DC6F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  heroText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#00000080',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 16,
    textAlign: 'left',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  featureBold: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  listItem: {
    flex: 1,
    fontSize: 14,
    color: '#424949',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7B7D7D',
    textAlign: 'center',
  },
});

export default AboutScreen;
