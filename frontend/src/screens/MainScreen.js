import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';
import {generateQRCodes} from '../services/api';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';

const MainScreen = ({route, navigation}) => {
  const {email, affiliation} = route.params;
  const {setAffiliation, qrCodes, setQrCodes, newUsers} = useWebSocket();
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const qrData = await generateQRCodes(affiliation, email);
        setQrCodes({qrCode1: qrData.qrCode1, qrCode2: qrData.qrCode2});
      } catch (error) {
        console.error('Error generating QR codes:', error);
      }
    };

    fetchQRCodes();
    setAffiliation(affiliation); // affiliation 설정
  }, [affiliation, email, setAffiliation, setQrCodes]);

  const handleNavigateToMode = () => {
    navigation.navigate('ModeSelection');
  };

  const handleShowQrCode = () => {
    setShowQrCode(true);
  };

  return (
    <View style={styles.container}>
      <LogoLeftTop />
      {!showQrCode ? (
        <>
          <Title>선생님과 함께 해봐요!</Title>
          <View style={styles.qrGenarationButtonBox}>
            <Text style={styles.description}>
              아래 버튼을 눌러{'\n'}아이들을 초대할 QR 코드를 생성할 수 있어요.
            </Text>
            <TouchableOpacity
              style={styles.qrGenarationButton}
              onPress={handleShowQrCode}>
              <Text style={styles.buttonText}>QR 코드 생성하기</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Title>QR코드를 찍어보자.</Title>
          <View style={styles.qrBox}>
            <Text style={styles.description}>
              카메라를 키고 {'\n'}
              QR 코드가 내 화면에 담기도록 찍어볼까요?
            </Text>
            <Image style={styles.qrCode} source={{uri: qrCodes.qrCode1}} />
          </View>
          <TouchableOpacity
            style={styles.modeSelectButton}
            onPress={handleNavigateToMode}>
            <Text style={styles.buttonText}>Select Mode</Text>
          </TouchableOpacity>
          <View style={styles.newUserShowBox}>
            {newUsers.map((user, index) => (
              <Text key={index}>{user.nickname}</Text>
            ))}
          </View>
        </>
      )}
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
  qrBox: {
    marginTop: 80,
  },
  qrCode: {
    width: 450,
    height: 450,
    borderRadius: 30,
  },
  qrGenarationButtonBox: {
    alignItems: 'center',
  },
  qrGenarationButton: {
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    width: 400,
    height: 80,
  },
  buttonText: {
    fontSize: 25,
    color: '#000',
    fontWeight: '500',
  },
  modeSelectButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  newUserShowBox: {
    position: 'absolute',
    width: 200,
    height: 250,
    right: 80,
    bottom: 90,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
});

export default MainScreen;
