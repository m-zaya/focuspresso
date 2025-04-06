// SplashScreen.js
// This component renders the initial splash screen that users see when they open the app
// It displays the app title, a coffee icon, and instructions to proceed

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image 
} from 'react-native';

// The SplashScreen component accepts a navigation prop to allow navigation to other screens
const SplashScreen = ({ navigation }) => {
  
  // Function to handle the press event on the splash screen
  const handlePress = () => {
    // Navigate to the Tasks screen using React Navigation
    navigation.navigate('Main');
  };

  return (
    // SafeAreaView ensures the content is displayed within the safe area boundaries of the device
    <SafeAreaView style={styles.container}>
      {/* Set the status bar style */}
      <StatusBar barStyle="dark-content" backgroundColor="#B5D1D7" />
      
      {/* TouchableOpacity wraps the entire screen content to make it all touchable */}
      <TouchableOpacity 
        style={styles.touchableArea} 
        onPress={handlePress}
        activeOpacity={0.8} // Slight opacity change when pressed
      >
        <View style={styles.content}>
          {/* Coffee cup image */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/coffee-icon.png')} 
              style={styles.coffeeImage} 
              resizeMode="contain"
            />
          </View>
          
          {/* App title */}
          <Text style={styles.title}>focuspresso</Text>
          
          {/* Instruction text at the bottom */}
          <Text style={styles.instructionText}>
            Press anywhere to continue
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles for the SplashScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D1D7', // Light blue/teal background color from the screenshot
  },
  touchableArea: {
    flex: 1, // Takes up the entire screen
  },
  content: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'space-between', // Distribute space between elements
    padding: 20,
  },
  logoContainer: {
    marginTop: '33%', // Position the logo in the middle of the screen
  },
  coffeeImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 48, // Larger font size for the title
    fontWeight: 'bold',
    bottom: 350,
    color: '#2D2D4A', // Dark navy/purple color from the screenshot
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 20,
    color: '#2D2D4A', // Same dark color as the title
    position: 'absolute',
    bottom: 60, // Position from the bottom of the screen
    alignSelf: 'center', // Center horizontally
    textAlign: 'center',
  },
});

export default SplashScreen;