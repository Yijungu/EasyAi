import React from 'react';
import {Image, StyleSheet} from 'react-native';

const LogoCenter = ({style}) => {
  return (
    <Image
      source={require('../../assets/Logo.png')}
      style={[styles.image, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '30%', // 이미지의 너비를 부모 컨테이너의 80%로 설정
    height: undefined,
    aspectRatio: 1, // 이미지의 종횡비를 1:1로 설정
    marginBottom: 200,
  },
});

export default LogoCenter;
