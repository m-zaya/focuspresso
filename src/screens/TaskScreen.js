// screens/TaskScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import DateNavigator from '../components/DateNavigator';
import TaskList from '../components/TaskList';
import AddTaskButton from '../components/AddTaskButton';
import AddTaskModal from '../components/AddTaskModal';
import TaskStorage from '../utils/TaskStorage';

const TaskScreen = () => {
  // State to keep track of the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for tasks
  const [tasks, setTasks] = useState([]);
  // State for controlling the add task modal
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const [editingTask, setEditingTask] = useState(null);
  
  // Load tasks for the selected date
  useEffect(() => {
    const loadTasksForDate = async () => {
      setIsLoading(true);
      try {
        const loadedTasks = await TaskStorage.loadTasks(selectedDate);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasksForDate();
  }, [selectedDate]);
  
  // Function to navigate to the previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  // Function to navigate to the next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  // Function to go back to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Function to handle task completion
  const handleCompleteTask = async (taskId) => {
    try {
      // Update locally first for immediate UI response
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      
      // Then update in storage
      await TaskStorage.updateTaskCompletion(selectedDate, taskId, true);
      
      // If the task is completed, we might need to refresh tasks
      // to see any new tasks that were created due to repetition
      if (updatedTasks.find(task => task.id === taskId)?.isRepeating) {
        const refreshedTasks = await TaskStorage.loadTasks(selectedDate);
        setTasks(refreshedTasks);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      // If there's an error, revert the local change
      const loadedTasks = await TaskStorage.loadTasks(selectedDate);
      setTasks(loadedTasks);
    }
  };
  
  // Function to handle adding a new task
  const handleAddTask = async (newTask) => {
    try {
      // Update locally first
      setTasks([...tasks, newTask]);
      
      // Then update in storage
      await TaskStorage.addTask(selectedDate, newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      // If there's an error, revert the local change
      const loadedTasks = await TaskStorage.loadTasks(selectedDate);
      setTasks(loadedTasks);
    }
  };
  
  // Function to handle editing a task
  const handleEditTask = async (updatedTask) => {
    try {
        // Update locally first
        const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
    );
      setTasks(updatedTasks);
      
      // Then update in storage
      // First get all tasks for the date
      const currentTasks = await TaskStorage.loadTasks(selectedDate);
      // Replace the task with the updated version
      const newTasks = currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      // Save back to storage
      await TaskStorage.saveTasks(selectedDate, newTasks);
      
      // Reset editing state
      setEditingTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
      // If there's an error, revert the local change
      const loadedTasks = await TaskStorage.loadTasks(selectedDate);
      setTasks(loadedTasks);
    }
  };
  
  // Add a function to start editing a task
  const startEditingTask = (task) => {
    setEditingTask(task);
    setAddTaskModalVisible(true);
  };

  const toggleAddTaskModal = () => {
    setAddTaskModalVisible(prevState => !prevState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B5D1D7" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>focuspresso</Text>
      </View>
      
      <DateNavigator
        currentDate={selectedDate}
        onPreviousDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onToday={goToToday}
      />
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9370DB" />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : (
            <TaskList 
            tasks={tasks} 
            onCompleteTask={handleCompleteTask}
            onEditTask={startEditingTask}
            />
        )}
      </View>
      
      <AddTaskButton onPress={toggleAddTaskModal} />
      <AddTaskModal
        visible={isAddTaskModalVisible}
        onClose={() => {
            setAddTaskModalVisible(false);
            setEditingTask(null); // Reset editing state when closing
        }}
        onAddTask={handleAddTask}
        editingTask={editingTask}
        onEditTask={handleEditTask}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#B5D1D7',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D2D4A',
  },
  content: {
    flex: 1,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2D2D4A',
  },
});

export default TaskScreen;