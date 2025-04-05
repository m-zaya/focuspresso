import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { TaskContext } from '../contexts/TaskContext';
import { GameContext } from '../contexts/GameContext';
import TaskItem from '../components/TaskItem';

const HomeScreen = () => {
  const { tasks, currentTaskIndex, addTask, completeCurrentTask, deleteTask } = useContext(TaskContext);
  const { character, dailyChallenge } = useContext(GameContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const currentTask = tasks[currentTaskIndex];
  
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      createdAt: new Date().toISOString()
    });
    
    // Reset form and close modal
    setNewTaskTitle('');
    setNewTaskDescription('');
    setModalVisible(false);
  };

  const handleCompleteTask = (taskId) => {
    completeCurrentTask();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Character Status */}
        <View style={styles.characterSection}>
          <View style={styles.characterBox}>
            <Text style={styles.characterEmoji}>🧙</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.levelText}>Level {character.level}</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(character.experience % 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.expText}>
              {character.experience % 100}/100 XP
            </Text>
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
          <View style={styles.challengeBox}>
            <Text style={styles.challengeText}>{dailyChallenge.challenge || 'Loading challenge...'}</Text>
            {dailyChallenge.completed ? (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>Completed!</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Current Task */}
        <View style={styles.taskSection}>
          <Text style={styles.sectionTitle}>Current Task</Text>
          {currentTask ? (
            <TaskItem 
              task={currentTask}
              isCurrent={true}
              onComplete={handleCompleteTask}
              onDelete={deleteTask}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No current task</Text>
              <Text style={styles.emptyStateSubText}>Add a task to get started</Text>
            </View>
          )}
        </View>

        {/* Upcoming Tasks */}
        {tasks.length > currentTaskIndex + 1 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            {tasks.slice(currentTaskIndex + 1, currentTaskIndex + 4).map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                isCurrent={false}
                onDelete={deleteTask}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Task Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  characterBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f0e6ff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  characterEmoji: {
    fontSize: 32,
  },
  statsContainer: {
    flex: 1,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9370DB',
  },
  expText: {
    fontSize: 12,
    color: '#666',
  },
  challengeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  challengeBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeText: {
    fontSize: 16,
    color: '#333',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskSection: {
    marginBottom: 16,
  },
  upcomingSection: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9370DB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#9370DB',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

})