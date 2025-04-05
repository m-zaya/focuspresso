import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { TaskContext } from '../contexts/TaskContext';

const SettingsScreen = () => {
  const { resetTasks } = useContext(TaskContext);
  
  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [notificationInterval, setNotificationInterval] = useState('20'); // minutes
  const [soundEffects, setSoundEffects] = useState(true);
  const [pixelatedTheme, setPixelatedTheme] = useState(true);
  
  // Handle reset all tasks
  const handleResetTasks = () => {
    Alert.alert(
      'Reset All Tasks',
      'Are you sure you want to reset all tasks? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            resetTasks();
            Alert.alert('Success', 'All tasks have been reset.');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Update notification interval
  const handleIntervalChange = (value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setNotificationInterval(numericValue);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#c4b0f5' }}
            thumbColor={notifications ? '#9370DB' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notification Interval (minutes)</Text>
          <TextInput
            style={styles.intervalInput}
            value={notificationInterval}
            onChangeText={handleIntervalChange}
            keyboardType="numeric"
            maxLength={3}
            editable={notifications}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={soundEffects}
            onValueChange={setSoundEffects}
            trackColor={{ false: '#767577', true: '#c4b0f5' }}
            thumbColor={soundEffects ? '#9370DB' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Pixelated Theme</Text>
          <Switch
            value={pixelatedTheme}
            onValueChange={setPixelatedTheme}
            trackColor={{ false: '#767577', true: '#c4b0f5' }}
            thumbColor={pixelatedTheme ? '#9370DB' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleResetTasks}
        >
          <Text style={styles.dangerButtonText}>Reset All Tasks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Focuspresso is designed to help you stay focused and productive by enforcing a sequential approach to tasks. Complete tasks in order, earn rewards, and customize your pixelated character!
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  intervalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default SettingsScreen;