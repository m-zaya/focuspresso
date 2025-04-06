// navigation/AppNavigator.js
// This file sets up the navigation structure for the app
// It defines the different screens and how they connect

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Import screens
import SplashScreen from '../screens/SplashScreen';

// Create a placeholder for the Tasks screen
// This will be replaced with the actual implementation later
const TasksScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tasks Screen (Placeholder)</Text>
  </View>
);

// Create a stack navigator
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Hide the navigation header
        }}
      >
        {/* Define screens in the stack */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;