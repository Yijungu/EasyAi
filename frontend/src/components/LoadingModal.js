import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import Loading1 from '../../assets/Loading/Loading_1.png';

const LoadingModal = ({visible, onClose}) => {
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1500,
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
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LogoLeftTop />
          <Title>잠시만 기다려주세요.</Title>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FBE3C7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  description: {
    fontSize: 25,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6F61',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LoadingModal;
