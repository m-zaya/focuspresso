// components/DateNavigator.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DateNavigator = ({ currentDate, onPreviousDay, onNextDay, onToday }) => {
  // Format the date to display: "Weekday, Month Day, Year"
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Check if the current date is today
  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={onPreviousDay}
      >
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        {!isToday() && (
          <TouchableOpacity onPress={onToday}>
            <Text style={styles.todayText}>Back to Today</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={onNextDay}
      >
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#B5D1D7',
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 22,
    color: '#2D2D4A',
    fontWeight: 'bold',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D4A',
  },
  todayText: {
    fontSize: 12,
    color: '#2D2D4A',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});

export default DateNavigator;