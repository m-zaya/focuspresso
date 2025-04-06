// utils/TaskStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@focuspresso_tasks';

/**
 * Helper function to format a date as YYYY-MM-DD for storage keys
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * TaskStorage utility for handling task persistence
 */
const TaskStorage = {
  /**
   * Save tasks for a specific date
   * @param {Date} date - The date for which to save tasks
   * @param {Array} tasks - Array of task objects
   * @returns {Promise} - Promise resolving when save is complete
   */
  saveTasks: async (date, tasks) => {
    try {
      // Get the date key in format YYYY-MM-DD
      const dateKey = formatDateKey(date);
      
      // First, get the existing tasks object
      const existingTasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const existingTasks = existingTasksJSON ? JSON.parse(existingTasksJSON) : {};
      
      // Update tasks for the specific date
      existingTasks[dateKey] = tasks;
      
      // Save back to storage
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(existingTasks));
      
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  },
  
  /**
   * Load tasks for a specific date
   * @param {Date} date - The date for which to load tasks
   * @returns {Promise<Array>} - Promise resolving to array of tasks
   */
  loadTasks: async (date) => {
    try {
      // Get the date key in format YYYY-MM-DD
      const dateKey = formatDateKey(date);
      
      // Get the tasks object from storage
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = tasksJSON ? JSON.parse(tasksJSON) : {};
      
      // Return tasks for the specific date or an empty array if none exist
      return tasks[dateKey] || [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },
  
  /**
   * Load all tasks
   * @returns {Promise<Object>} - Promise resolving to object with dates as keys and task arrays as values
   */
  loadAllTasks: async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJSON ? JSON.parse(tasksJSON) : {};
    } catch (error) {
      console.error('Error loading all tasks:', error);
      return {};
    }
  },
  
  /**
   * Add a new task for a specific date
   * @param {Date} date - The date for which to add the task
   * @param {Object} newTask - The new task object to add
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  addTask: async (date, newTask) => {
    try {
      // Load existing tasks for the date
      const tasks = await TaskStorage.loadTasks(date);
      
      // Add the new task
      tasks.push(newTask);
      
      // Save the updated tasks
      await TaskStorage.saveTasks(date, tasks);
      
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  },
  
  /**
   * Update a task's completion status
   * @param {Date} date - The date of the task
   * @param {string|number} taskId - The ID of the task to update
   * @param {boolean} completed - The new completion status
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  updateTaskCompletion: async (date, taskId, completed) => {
    try {
      // Load existing tasks for the date
      const tasks = await TaskStorage.loadTasks(date);
      
      // Find and update the task
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      
      // Save the updated tasks
      await TaskStorage.saveTasks(date, updatedTasks);
      
      // If the task is repeating, we need to handle it differently
      const completedTask = tasks.find(task => task.id === taskId);
      if (completedTask && completedTask.isRepeating && completedTask.repeatDays && completedTask.repeatDays.length > 0) {
        await TaskStorage.handleRepeatingTask(completedTask, date);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating task completion:', error);
      return false;
    }
  },
  
  /**
   * Update a task's details
   * @param {Date} date - The date of the task
   * @param {Object} updatedTask - The updated task object
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  updateTask: async (date, updatedTask) => {
    try {
      // Load existing tasks for the date
      const tasks = await TaskStorage.loadTasks(date);
      
      // Find and update the task
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      // Save the updated tasks
      await TaskStorage.saveTasks(date, updatedTasks);
      
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },
  
  /**
   * Handle repeating tasks by creating them for future dates
   * @param {Object} task - The task object
   * @param {Date} currentDate - The date of the current task
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  handleRepeatingTask: async (task, currentDate) => {
    try {
      // Create new task instances for future weeks based on repeat days
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayIndex = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Create task for each selected repeat day in the next week
      for (const dayName of task.repeatDays) {
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        if (targetDayIndex === -1) continue; // Skip if invalid day name
        
        // Calculate days to add to get to the next occurrence
        let daysToAdd = targetDayIndex - currentDayIndex;
        if (daysToAdd <= 0) daysToAdd += 7; // Move to next week if day has already passed
        
        // Create date for next occurrence
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + daysToAdd);
        
        // Create new task object for next occurrence
        const newTaskId = Date.now().toString() + `-${dayName}`;
        const newTask = {
          ...task,
          id: newTaskId,
          dueDate: new Date(
            nextDate.getFullYear(),
            nextDate.getMonth(),
            nextDate.getDate(),
            new Date(task.dueDate).getHours(),
            new Date(task.dueDate).getMinutes()
          ).toISOString(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        
        // Add the new task
        await TaskStorage.addTask(nextDate, newTask);
      }
      
      return true;
    } catch (error) {
      console.error('Error handling repeating task:', error);
      return false;
    }
  },
  
  /**
   * Delete a task
   * @param {Date} date - The date of the task
   * @param {string|number} taskId - The ID of the task to delete
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  deleteTask: async (date, taskId) => {
    try {
      // Load existing tasks for the date
      const tasks = await TaskStorage.loadTasks(date);
      
      // Filter out the task to delete
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      
      // Save the updated tasks
      await TaskStorage.saveTasks(date, updatedTasks);
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },
  
  /**
   * Clear all tasks (useful for debugging or reset)
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  clearAllTasks: async () => {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  },
};

export default TaskStorage;