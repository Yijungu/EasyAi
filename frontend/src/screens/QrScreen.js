import React from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';
import LogoCenter from '../components/LogoCenter';

const QrScreen = ({navigation}) => {
  const {qrCodes} = useWebSocket();

  const handleNavigateToMode = () => {
    navigation.navigate('ModeSelection');
  };

  return (
    <View style={styles.container}>
      <LogoCenter />
      <Text style={styles.title}>QR 코드를 찍어보세요.</Text>
      <Image style={styles.qrCode} source={{uri: qrCodes.qrCode1}} />
      <Button title="Select Mode" onPress={handleNavigateToMode} />
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
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default QrScreen;
