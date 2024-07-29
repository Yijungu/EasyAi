import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import CanvasScreen from '../components/Canvas/Canvas'; // CanvasScreen을 임포트합니다

const CanvasLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LogoLeftTop />
      <>
        <Title>그림 그리기</Title>
        <View style={styles.Box}>
          <Text style={styles.description}>
            선생님이 준비할동안, 그림을 그리고 놀아볼까요?{'\n'}
            내가 좋아하는 것들을 그려봐요.
          </Text>
          <>
            <CanvasScreen />
          </>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FBE3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 25,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  Box: {
    marginTop: 80,
    width: '80%',
    height: '80%',
    zIndex: 100,
  },
});

export default CanvasLoadingScreen;
