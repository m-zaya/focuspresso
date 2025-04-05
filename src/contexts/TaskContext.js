import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Load tasks from storage on app start
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await AsyncStorage.getItem('tasks');
        const completedData = await AsyncStorage.getItem('completedTasks');
        const currentIndexData = await AsyncStorage.getItem('currentTaskIndex');
        
        if (tasksData) setTasks(JSON.parse(tasksData));
        if (completedData) setCompletedTasks(JSON.parse(completedData));
        if (currentIndexData) setCurrentTaskIndex(JSON.parse(currentIndexData));
      } catch (error) {
        console.log('Error loading tasks from storage:', error);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        await AsyncStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        await AsyncStorage.setItem('currentTaskIndex', JSON.stringify(currentTaskIndex));
      } catch (error) {
        console.log('Error saving tasks to storage:', error);
      }
    };

    saveTasks();
  }, [tasks, completedTasks, currentTaskIndex]);

  // Add a new task to the list
  const addTask = (task) => {
    setTasks([...tasks, { id: Date.now().toString(), ...task, completed: false }]);
  };

  // Mark the current task as completed and move to the next
  const completeCurrentTask = () => {
    if (currentTaskIndex >= tasks.length) return;
    
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex].completed = true;
    
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, updatedTasks[currentTaskIndex]]);
    setCurrentTaskIndex(currentTaskIndex + 1);
    
    return tasks[currentTaskIndex]; // Return the completed task for rewards
  };

  // Get the current task
  const getCurrentTask = () => {
    if (currentTaskIndex >= tasks.length) return null;
    return tasks[currentTaskIndex];
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    // If deleting the current task or a task before it, adjust the current index
    if (taskIndex <= currentTaskIndex && currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
    
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Reset all tasks
  const resetTasks = () => {
    setTasks([]);
    setCompletedTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasks,
        currentTaskIndex,
        addTask,
        completeCurrentTask,
        getCurrentTask,
        deleteTask,
        resetTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};