import React from 'react';
import {View, StyleSheet, Image, Button} from 'react-native';
import LoginSelectionButton from '../components/LoginSelectionButton';
import LogoCenter from '../components/LogoCenter';

const LoginSelectionScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <LogoCenter />
      <View style={styles.buttonContainer}>
        <LoginSelectionButton
          style={styles.button}
          title="선생님 로그인"
          onPress={() => navigation.navigate('Login')}
        />
        <LoginSelectionButton
          style={styles.button}
          title="어린이 로그인"
          onPress={() => navigation.navigate('ChildLogin')}
        />
      </View>
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
  buttonContainer: {
    width: '35%',
    height: 180,
    marginBottom: 100,
    justifyContent: 'space-between', // 버튼들이 위와 아래에 붙도록 설정
  },
});

export default LoginSelectionScreen;
