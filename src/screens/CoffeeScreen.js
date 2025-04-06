// screens/CalendarScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CoffeeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coffee Screen: </Text>
      <Text style={styles.text}>games / character / fun / COFFEE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#2D2D4A',
  },
});

export default CoffeeScreen;;