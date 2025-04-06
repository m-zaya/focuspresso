// components/AddTaskModal.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

const AddTaskModal = ({ visible, onClose, onAddTask, editingTask = null, onEditTask = null }) => {
  // Basic task info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Due date
  const [dueDate, setDueDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  
  // Priority (1-3, where 3 is highest)
  const [priority, setPriority] = useState(1);
  
  // Weekly repetition
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  
  // Notification settings
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [notificationInterval, setNotificationInterval] = useState({
    hours: 0,
    minutes: 15
  });
  const [notificationDuration, setNotificationDuration] = useState({
    hours: 1,
    minutes: 0
  });

  // Effect to populate form when editing a task
React.useEffect(() => {
    if (editingTask) {
      // Populate form fields with existing task data
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(new Date(editingTask.dueDate));
      setPriority(editingTask.priority);
      setIsRepeating(editingTask.isRepeating || false);
      
      // Handle repeat days
      if (editingTask.repeatDays && editingTask.repeatDays.length > 0) {
        const initialRepeatDays = {
          Sunday: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
        };
        
        // Set selected days based on the task's repeatDays array
        editingTask.repeatDays.forEach(day => {
          initialRepeatDays[day] = true;
        });
        
        setRepeatDays(initialRepeatDays);
      }
      
      // Handle notifications
      setEnableNotifications(!!editingTask.notifications);
      if (editingTask.notifications) {
        setNotificationInterval(editingTask.notifications.interval || { hours: 0, minutes: 15 });
        setNotificationDuration(editingTask.notifications.duration || { hours: 1, minutes: 0 });
      }
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingTask]); // Only run when editingTask changes
  
  // Dismiss keyboard when tapping outside of input fields
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  // Date picker handlers
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  
  const handleConfirmDate = (date) => {
    setDueDate(date);
    hideDatePicker();
  };
  
  // Toggle repeat day
  const toggleRepeatDay = (day) => {
    setRepeatDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Submit form
  const handleSubmit = () => {
    if (title.trim() === '') {
      return; // Don't submit if title is empty
    }
    
    // Prepare repeating days array
    const repeatingDays = isRepeating 
      ? Object.entries(repeatDays)
          .filter(([_, isSelected]) => isSelected)
          .map(([day]) => day)
      : [];
    
    // Create task object with form data
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: parseInt(priority),
      dueDate: dueDate.toISOString(),
      completed: editingTask ? editingTask.completed : false,
      isRepeating: isRepeating,
      repeatDays: repeatingDays,
      notifications: enableNotifications ? {
        interval: notificationInterval,
        duration: notificationDuration
      } : null
    };
    
    if (editingTask) {
      // For editing, preserve the original ID and creation date
      const updatedTask = {
        ...taskData,
        id: editingTask.id,
        createdAt: editingTask.createdAt
      };
      
      // Call the edit handler
      onEditTask(updatedTask);
    } else {
      // For adding new tasks
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      onAddTask(newTask);
    }
    
    // Close modal
    onClose();
  };
  
  // Reset the form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setPriority(1);
    setIsRepeating(false);
    setRepeatDays({
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    });
    setEnableNotifications(false);
    setNotificationInterval({ hours: 0, minutes: 15 });
    setNotificationDuration({ hours: 1, minutes: 0 });
  };
  
  // Create time picker for intervals
  const renderTimePicker = (label, value, onChange, max = { hours: 23, minutes: 59 }) => (
    <View style={styles.timePickerContainer}>
      <Text style={styles.timePickerLabel}>{label}</Text>
      <View style={styles.timeInputRow}>
        <View style={styles.timeInputGroup}>
          <Picker
            selectedValue={value.hours.toString()}
            style={styles.timePicker}
            itemStyle={styles.timePickerItem}
            onValueChange={(itemValue) => 
              onChange({ ...value, hours: parseInt(itemValue) })
            }
          >
            {Array.from({ length: max.hours + 1 }, (_, i) => (
              <Picker.Item key={`h-${i}`} label={`${i} hr`} value={i.toString()} />
            ))}
          </Picker>
        </View>
        
        <View style={styles.timeInputGroup}>
          <Picker
            selectedValue={value.minutes.toString()}
            style={styles.timePicker}
            itemStyle={styles.timePickerItem}
            onValueChange={(itemValue) => 
              onChange({ ...value, minutes: parseInt(itemValue) })
            }
          >
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59].map(min => (
              <Picker.Item key={`m-${min}`} label={`${min} min`} value={min.toString()} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.centeredView}>
        
        {/* Invisible overlay to dismiss keyboard when tapping outside the modal */}
        <View style={styles.modalOverlay} />

        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
        keyboardVerticalOffset={100}
        >
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingTask ? 'Edit Task' : 'Add New Task'}</Text>

            <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            >
            {/* -- All your form sections go here -- */}
            {/* Example: */}
            <View style={styles.section}>
                <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="What needs to be done?"
                    value={title}
                    onChangeText={setTitle}
                />
                </View>

                <View style={styles.formGroup}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add some details..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
                </View>
            </View>
        
        {/* Due Date & Priority Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={showDatePicker}
            >
              <Text style={styles.datePickerButtonText}>{formatDate(dueDate)}</Text>
            </TouchableOpacity>
            
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              date={dueDate}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 1 && styles.priorityButtonSelected,
                  { backgroundColor: priority === 1 ? '#90EE90' : '#f0f0f0' }
                ]}
                onPress={() => setPriority(1)}
              >
                <Text style={styles.priorityButtonText}>Low</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 2 && styles.priorityButtonSelected,
                  { backgroundColor: priority === 2 ? '#FFD700' : '#f0f0f0' }
                ]}
                onPress={() => setPriority(2)}
              >
                <Text style={styles.priorityButtonText}>Medium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 3 && styles.priorityButtonSelected,
                  { backgroundColor: priority === 3 ? '#FF6347' : '#f0f0f0' }
                ]}
                onPress={() => setPriority(3)}
              >
                <Text style={styles.priorityButtonText}>High</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Repetition Section */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Repeat Weekly</Text>
            <Switch
              value={isRepeating}
              onValueChange={setIsRepeating}
              trackColor={{ false: "#d3d3d3", true: "#9370DB" }}
              thumbColor={isRepeating ? "#6A5ACD" : "#f4f3f4"}
            />
          </View>
          
          {isRepeating && (
            <View style={styles.repeatDaysContainer}>
              {Object.keys(repeatDays).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    repeatDays[day] && styles.dayButtonSelected
                  ]}
                  onPress={() => toggleRepeatDay(day)}
                >
                  <Text 
                    style={[
                      styles.dayButtonText,
                      repeatDays[day] && styles.dayButtonTextSelected
                    ]}
                  >
                    {day.charAt(0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Notification Section */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable Notifications</Text>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: "#d3d3d3", true: "#9370DB" }}
              thumbColor={enableNotifications ? "#6A5ACD" : "#f4f3f4"}
            />
          </View>
          
          {enableNotifications && (
            <View style={styles.notificationOptions}>
              {/* Notification Interval */}
              {renderTimePicker(
                "Reminder Interval",
                notificationInterval,
                setNotificationInterval
              )}
              
              {/* Notification Duration */}
              {renderTimePicker(
                "Reminder Duration",
                notificationDuration,
                setNotificationDuration
              )}
            </View>
          )}
        </View>
        
        {/* Padding to ensure everything is scrollable */}
            <View style={styles.bottomPadding} />
            </ScrollView>

            <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.addButtonStyle]}
                onPress={handleSubmit}
            >
                <Text style={styles.addButtonText}>
                {editingTask ? 'Save Changes' : 'Add Task'}
                </Text>
            </TouchableOpacity>
            </View>
        </View>
        </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>

    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    height: '80%', // Fixed height
    maxHeight: 600,  // With a maximum
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D2D4A',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#2D2D4A',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2D2D4A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    borderWidth: 2,
    borderColor: '#2D2D4A',
  },
  priorityButtonText: {
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#2D2D4A',
  },
  repeatDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  dayButtonSelected: {
    backgroundColor: '#9370DB',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  notificationOptions: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  addButtonStyle: {
    backgroundColor: '#9370DB',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,  // Extra padding at the bottom to ensure everything is scrollable
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  timePickerContainer: {
    marginBottom: 16,
  },
  timePickerLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#2D2D4A',
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputGroup: {
    flex: 1,
    marginHorizontal: 4,
    height: 120, // Constrain the height
    overflow: 'hidden', // Prevent overflow
  },
  timePicker: {
    width: '100%',
    height: 120,
    backgroundColor: 'white',
  },
  timePickerItem: {
    fontSize: 16,
    height: 120, // Match the height of the picker
    color: '#2D2D4A',
  },
});

export default AddTaskModal;