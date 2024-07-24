import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Image} from 'react-native';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import Loading1 from '../../assets/Loading/Loading_1.png';

const SetModeLoadingScreen = ({navigation}) => {
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
    <View style={styles.container}>
      <LogoLeftTop />
      <Title>화면 공유를 준비 중이에요.</Title>
      <Animated.Image
        source={Loading1}
        style={[styles.image, {transform: [{rotate: rotation}]}]}
      />
      <Text style={styles.description}>
        화면 공유를 준비중이에요.{'\n'}
        잠시만 아이들과 기다려주세요.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBE3C7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
});

export default SetModeLoadingScreen;
