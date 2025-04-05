import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ task, isCurrent, onComplete, onDelete }) => {
  return (
    <View style={[styles.container, isCurrent && styles.currentTask]}>
      <View style={styles.taskContent}>
        <Text style={styles.title}>{task.title}</Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        
        {/* Only show the complete button if this is the current task */}
        {isCurrent && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => onComplete(task.id)}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  currentTask: {
    backgroundColor: '#f0e6ff',
    borderColor: '#d4c4ff',
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
});

export default TaskItem;