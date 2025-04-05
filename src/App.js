import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/contexts/TaskContext';
import { GameProvider } from './src/contexts/GameContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <GameProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GameProvider>
      </TaskProvider>
    </SafeAreaProvider>
  );
}