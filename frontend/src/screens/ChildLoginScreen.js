import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useWebSocket} from '../contexts/WebSocketContext';
import {handleChildLogin} from '../services/api';

const ChildLoginScreen = ({navigation}) => {
  const [nickname, setNickname] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const {status} = useWebSocket();
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'Camera permission is required to scan QR codes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Camera Permission',
              'Camera permission is required to scan QR codes.',
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        const cameraPermission = await Camera.requestCameraPermission();
        if (cameraPermission !== 'authorized') {
          Alert.alert(
            'Camera Permission',
            'Camera permission is required to scan QR codes.',
          );
        }
      }
    };

    requestCameraPermission();
  }, []);

  const onQRCodeRead = e => {
    setQrCode(e.nativeEvent.codeStringValue); // Save the scanned QR code data
    setIsModalVisible(true);
  };

  const handleLogin = async () => {
    try {
      const data = await handleChildLogin(qrCode, nickname);
      setAffiliation(data.schoolId);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', `Error processing QR Code: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={onQRCodeRead}
          frameProcessorFps={5}
        />
      )}
      <Text style={styles.centerText}>QR 코드를 스캔하세요</Text>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>닉네임을 입력하세요:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Nickname"
              value={nickname}
              onChangeText={setNickname}
            />
            <Button title="입력 완료" onPress={handleLogin} />
          </View>
        </View>
      </Modal>
      <Text>{status}</Text>
      {affiliation ? <Text>소속: {affiliation}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
});

export default ChildLoginScreen;
