import react from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AddTaskButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
     style={styles.button} 
     onPress={onPress}
     activeOpacity={0.8}>

      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#9370DB',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    buttonText: {
      fontSize: 32,
      color: 'white',
      fontWeight: 'bold',
      marginTop: -2, // Adjust vertical alignment
    },
  });
  
  export default AddTaskButton;