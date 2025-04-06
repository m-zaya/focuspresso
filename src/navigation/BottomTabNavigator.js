import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';

// Import screens
import TaskScreen from '../screens/TaskScreen';
import CoffeeScreen from '../screens/CoffeeScreen';
import AIScreen from '../screens/AIScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import the coffee image
import coffeeImage from '../assets/coffee-beans-pixel-art.png'; 

const Tab = createBottomTabNavigator();

// Custom tab bar icons
const TabBarIcon = ({ focused, iconName }) => {
  let icon;
  switch (iconName) {
    case 'ai':
      icon = '🤖';
      break;
    case 'tasks':
      icon = '📝';
      break;
    case 'settings':
      icon = '⚙️';
      break;
    default:
      icon = '•';
  }
  
  return (
    <Text style={[styles.icon, focused && styles.focusedIcon]}>
      {icon}
    </Text>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#9370DB',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Coffee"
        component={CoffeeScreen}
        options={{
          tabBarLabel: 'Coffee',
          tabBarIcon: ({ focused }) => (
            <Image
              source={coffeeImage}
              style={[
                styles.coffeeIcon,
                focused && styles.focusedCoffeeIcon,
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabel: 'AI',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName="ai" />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName="tasks" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName="settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 60,
  },
  icon: {
    fontSize: 24,
    marginBottom: -4,
  },
  focusedIcon: {
    color: '#9370DB',
  },
  coffeeIcon: {
    width: 38,
    height: 32,
    marginBottom: -4,
    opacity: 0.6,
  },
  focusedCoffeeIcon: {
    opacity: 1,
  },
});

export default BottomTabNavigator;
