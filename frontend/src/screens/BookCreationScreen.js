import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';
import LoadingModal from '../components/LoadingModal';

const MIN_QUESTION_COUNTS = {
  low: 5,
  medium: 10,
  high: 15,
};

const BookCreationScreen = ({navigation}) => {
  const [depth, setDepth] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const {creatingBook, loadingModalVisible} = useWebSocket();

  const handleDepthChange = selectedDepth => {
    setDepth(selectedDepth);
    const minCount = MIN_QUESTION_COUNTS[selectedDepth];
    if (questionCount < minCount) {
      setQuestionCount(minCount);
    }
  };

  const handleQuestionCountChange = change => {
    setQuestionCount(prevCount => {
      const newCount = prevCount + change;
      const minCount = MIN_QUESTION_COUNTS[depth];
      return newCount >= minCount ? newCount : minCount;
    });
  };

  const handleExtensionToggle = () => {
    setExtensionEnabled(prev => !prev);
  };

  const handleCreatButton = () => {
    creatingBook(depth, questionCount, extensionEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Book</Text>
      <View style={styles.depthContainer}>
        <Text style={styles.label}>Question Depth:</Text>
        <View style={styles.buttonGroup}>
          {['low', 'medium', 'high'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.depthButton,
                depth === level && styles.depthButtonSelected,
              ]}
              onPress={() => handleDepthChange(level)}>
              <Text
                style={[
                  styles.depthButtonText,
                  depth === level && styles.depthButtonTextSelected,
                ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.questionCountContainer}>
        <Text style={styles.label}>Question Count:</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => handleQuestionCountChange(-1)}
            disabled={questionCount <= MIN_QUESTION_COUNTS[depth]}>
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{questionCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => handleQuestionCountChange(1)}>
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.extensionContainer}>
        <Text style={styles.label}>Question Extension Enabled:</Text>
        <TouchableOpacity
          style={[
            styles.extensionButton,
            extensionEnabled && styles.extensionButtonEnabled,
          ]}
          onPress={handleExtensionToggle}>
          <Text style={styles.extensionButtonText}>
            {extensionEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingModal visible={loadingModalVisible}></LoadingModal>
      <Button title="Creat" onPress={handleCreatButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  depthContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  depthButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  depthButtonSelected: {
    backgroundColor: '#007BFF',
  },
  depthButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  depthButtonTextSelected: {
    fontWeight: '700',
  },
  questionCountContainer: {
    marginBottom: 25,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  counterButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  extensionContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  extensionButton: {
    width: 120,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extensionButtonEnabled: {
    backgroundColor: '#28A745',
  },
  extensionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default BookCreationScreen;
