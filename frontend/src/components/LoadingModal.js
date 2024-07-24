import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing'; // Import Easing
import Loading1 from '../../assets/Loading/Loading_1.png';

const LoadingModal = ({visible, onClose}) => {
  const rotationValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear, // Use linear easing for constant speed
          useNativeDriver: true,
        }),
      ).start();
    };

    startRotation();
  }, [rotationValue]);

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Animated.Image
            source={Loading1}
            style={[styles.image, {transform: [{rotate: rotation}]}]}
          />
          <Text style={styles.description}>
            화면 공유를 준비중이에요.{'\n'}
            잠시만 아이들과 기다려주세요.
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 250,
    padding: 20,
    backgroundColor: '#FBE3C7',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFA726',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LoadingModal;
