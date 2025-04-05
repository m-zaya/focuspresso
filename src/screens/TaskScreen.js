import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { TaskContext } from '../contexts/TaskContext';
import TaskItem from '../components/TaskItem';

const TaskScreen = () => {
  const { tasks, currentTaskIndex, addTask, completeCurrentTask, deleteTask } = useContext(TaskContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

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

  const renderItem = ({ item, index }) => {
    return (
      <TaskItem 
        task={item}
        isCurrent={index === currentTaskIndex}
        onComplete={completeCurrentTask}
        onDelete={deleteTask}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Tasks</Text>
        <TouchableOpacity 
          style={styles.addHeaderButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addHeaderButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubText}>Add your first task to get started</Text>
          <TouchableOpacity 
            style={styles.addEmptyButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addEmptyButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addHeaderButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addHeaderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  addEmptyButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  addEmptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default TaskScreen;