// components/TaskList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// Helper function to format date
const formatTaskDate = (dateString) => {
  const taskDate = new Date(dateString);
  const now = new Date();
  
  // Reset hours for date comparison
  const taskDateNoTime = new Date(taskDate).setHours(0, 0, 0, 0);
  const nowNoTime = new Date(now).setHours(0, 0, 0, 0);
  
  const isToday = taskDateNoTime === nowNoTime;
  
  if (isToday) {
    return `Today at ${taskDate.getHours().toString().padStart(2, '0')}:${taskDate.getMinutes().toString().padStart(2, '0')}`;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowNoTime = new Date(tomorrow).setHours(0, 0, 0, 0);
  const isTomorrow = taskDateNoTime === tomorrowNoTime;
  
  if (isTomorrow) {
    return `Tomorrow at ${taskDate.getHours().toString().padStart(2, '0')}:${taskDate.getMinutes().toString().padStart(2, '0')}`;
  }
  
  return `${taskDate.toLocaleDateString()} at ${taskDate.getHours().toString().padStart(2, '0')}:${taskDate.getMinutes().toString().padStart(2, '0')}`;
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  let backgroundColor, text;
  
  switch (priority) {
    case 3:
      backgroundColor = '#FF6347'; // Tomato for high priority
      text = 'High';
      break;
    case 2:
      backgroundColor = '#FFD700'; // Gold for medium priority
      text = 'Medium';
      break;
    case 1:
    default:
      backgroundColor = '#90EE90'; // Light green for low priority
      text = 'Low';
      break;
  }
  
  return (
    <View style={[styles.priorityBadge, { backgroundColor }]}>
      <Text style={styles.priorityText}>{text}</Text>
    </View>
  );
};

// Notification indicator component
const NotificationIndicator = ({ enabled }) => {
  if (!enabled) return null;
  
  return (
    <View style={styles.notificationIndicator}>
      <Text style={styles.notificationIcon}>🔔</Text>
    </View>
  );
};

// Repeating task indicator component
const RepeatIndicator = ({ isRepeating, repeatDays }) => {
  if (!isRepeating || !repeatDays || repeatDays.length === 0) return null;
  
  return (
    <View style={styles.repeatIndicator}>
      <Text style={styles.repeatIcon}>🔄</Text>
      <Text style={styles.repeatText}>
        {repeatDays.map(day => day.charAt(0)).join('')}
      </Text>
    </View>
  );
};

const TaskItem = ({ task, onComplete, isLocked, onEdit }) => {
    // Convert string date to Date object
    const dueDate = new Date(task.dueDate);
    
    return (
      <View style={[
        styles.taskItem, 
        task.completed ? styles.completedTask : null,
        isLocked ? styles.lockedTask : null
      ]}>
        <TouchableOpacity 
          style={styles.taskContent}
          onPress={() => !isLocked && onEdit(task)}
          disabled={isLocked}
        >
          <View style={styles.taskHeader}>
            <Text style={[
              styles.taskTitle,
              task.completed ? styles.completedText : null,
              isLocked ? styles.lockedText : null
            ]}>
              {task.title}
            </Text>
            
            <View style={styles.taskMetaContainer}>
              <PriorityBadge priority={task.priority} />
              <NotificationIndicator enabled={task.notifications} />
              <RepeatIndicator 
                isRepeating={task.isRepeating} 
                repeatDays={task.repeatDays} 
              />
            </View>
          </View>
          
          {task.description ? (
            <Text style={[
              styles.taskDescription,
              task.completed ? styles.completedText : null,
              isLocked ? styles.lockedText : null
            ]}>
              {task.description}
            </Text>
          ) : null}
          
          <Text style={[styles.dueDate, dueDate < new Date() && !task.completed ? styles.pastDueDate : null]}>
            Due: {formatTaskDate(dueDate)}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.taskAction}>
          {isLocked ? (
            <View style={styles.lockIndicator}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          ) : task.completed ? (
            <View style={styles.completedIndicator}>
              <Text style={styles.completedIndicatorText}>✓</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => onComplete(task.id)}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

const TaskList = ({ tasks, onCompleteTask, onEditTask }) => {
  // Function to check if a task should be locked
  // A task is locked if any previous uncompleted task exists
  const isTaskLocked = (index) => {
    for (let i = 0; i < index; i++) {
      if (!tasks[i].completed) {
        return true;
      }
    }
    return false;
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TaskItem
         task={item}
         onComplete={onCompleteTask}
         isLocked={isTaskLocked(index)}
         onEdit={onEditTask}
        />
      )}
      style={styles.list}
      contentContainerStyle={tasks.length === 0 ? styles.emptyList : null}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No tasks for this day</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    backgroundColor: '#f8f8f8',
    opacity: 0.8,
  },
  lockedTask: {
    backgroundColor: '#f0f0f0',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D4A',
    flex: 1,
    marginRight: 8,
  },
  taskMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  dueDate: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  lockedText: {
    color: '#999',
  },
  taskAction: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  completedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIndicatorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  lockIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 16,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIndicator: {
    marginRight: 6,
  },
  notificationIcon: {
    fontSize: 14,
  },
  repeatIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  repeatText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  pastDueDate: {
    color: '#FF3B30', // iOS red color, but you can use any shade of red
    fontWeight: '500',  // Make it slightly bolder for emphasis
  },
});

export default TaskList; 