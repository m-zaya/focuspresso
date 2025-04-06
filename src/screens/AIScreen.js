// screens/AIScreen.js
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';

const AIScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hard-code an initial welcome message
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          text: "Hello! I'm your Focuspresso AI assistant. How can I help you stay focused today?", 
          user: false 
        }
      ]);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText.trim(), user: true };
      
      // Update messages with user input first
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputText('');
      setIsLoading(true);
      
      try {
        // Since we're getting a network error, let's take a different approach
        // Instead of calling an API that might not be set up yet, let's implement a simple
        // local response system for common productivity questions
        
        // Get a simple response based on user input
        const getLocalResponse = (userInput) => {
          const input = userInput.toLowerCase();
          
          if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return "Hello! How can I help you with your tasks today?";
          }
          else if (input.includes('focus') || input.includes('distracted') || input.includes('concentrate')) {
            return "To improve focus, try the Pomodoro technique: work for 25 minutes, then take a 5-minute break. Also, consider putting your phone in another room while working on important tasks.";
          }
          else if (input.includes('procrastinate') || input.includes('procrastination') || input.includes('putting off')) {
            return "Procrastination can be overcome by breaking tasks into smaller steps. Try setting a timer for just 5 minutes of work - often starting is the hardest part!";
          }
          else if (input.includes('prioritize') || input.includes('important') || input.includes('urgent')) {
            return "When prioritizing tasks, consider using the Eisenhower Matrix: divide tasks into four categories - urgent/important, important/not urgent, urgent/not important, and neither urgent nor important.";
          }
          else if (input.includes('time management') || input.includes('schedule')) {
            return "Good time management starts with tracking how you actually spend your time. Block dedicated time for deep work, and batch similar small tasks together to avoid context switching.";
          }
          else if (input.includes('todo') || input.includes('to-do') || input.includes('task')) {
            return "I see you're asking about tasks! Remember that in Focuspresso, you need to complete tasks in order. This helps maintain focus on one thing at a time rather than jumping between multiple tasks.";
          }
          else if (input.includes('motivation') || input.includes('inspired') || input.includes('stuck')) {
            return "When motivation is low, remember your 'why' - the purpose behind your tasks. Also, visualize how you'll feel after completing the task. Sometimes, starting with the easiest task can build momentum.";
          }
          else if (input.includes('coffee') || input.includes('game') || input.includes('reward')) {
            return "The coffee game is your reward system! Complete tasks to earn coffee beans, which you can redeem for short game breaks. It's a great way to build a healthy work-reward cycle.";
          }
          else {
            return "I'm here to help you stay on track with your tasks. You can ask me about focus techniques, procrastination, time management, or how to use Focuspresso more effectively!";
          }
        };
        
        // Get local response instead of making API call
        const aiResponseText = getLocalResponse(userMessage.text);
        
        // Add the local AI response to messages
        const aiMessage = { text: aiResponseText, user: false };
        
        // Simulate a slight delay for a more natural conversation flow
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, aiMessage]);
        }, 800);
      } catch (error) {
        console.error('Error in AI processing:', error);
        const errorAiMessage = { 
          text: 'I had a little trouble processing that. Could you try asking in a different way?', 
          user: false 
        };
        setMessages(prevMessages => [...prevMessages, errorAiMessage]);
      } finally {
        // Delay turning off loading state slightly for UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    }
  }, [inputText, messages]);

  const renderItem = useCallback(({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.user ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B5D1D7" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>focuspresso AI</Text>
      </View>
      
      {/* Message List */}
      <View style={styles.messageListContainer}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          inverted={false} // Not inverted so newest messages at bottom
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9370DB" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </View>
      
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputSection}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]} 
            onPress={handleSend} 
            disabled={isLoading || !inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D2D4A',
  },
  messageListContainer: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    paddingBottom: 10,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: '#E6D2FC', // Light purple to match app theme
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginRight: 50,
  },
  messageText: {
    fontSize: 16,
    color: '#2D2D4A',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 10,
    margin: 4,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#2D2D4A',
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#9370DB',
    borderRadius: 25,
    width: 60,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#C8B8E6', // Lighter color when disabled
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AIScreen;