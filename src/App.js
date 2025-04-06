// App.js - Main entry point
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

// Import SplashScreen component
import SplashScreen from './screens/SplashScreen';

// Create a placeholder for the Tasks screen (using your current App content)
const TasksScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#9370DB" />
      <View style={styles.content}>
        <Text style={styles.title}>Focuspresso</Text>
        <Text style={styles.subtitle}>Stay focused, one task at a time</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed!')}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9370DB',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#9370DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});