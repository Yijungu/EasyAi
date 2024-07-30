import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import VoiceUtil from '../utils/VoiceUtil';

const ProtagonistCreatingScreen = () => {
  const [isRecording, setIsRecording] = useState(false); // 초기값을 false로 설정
  const [onRecording, setOnRecording] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    VoiceUtil.setSpeechResultCallback(results => {
      setAnswer(results[0]);
      setIsRecording(true); // 녹음이 완료된 상태로 설정
      setOnRecording(false); // 녹음 중지 상태로 설정
    });

    VoiceUtil.setErrorCallback(error => {
      Alert.alert('인식하지 못했습니다. 다시 입력해주세요.');
      setOnRecording(false);
      setIsRecording(false); // 녹음해야 하는 상태로 설정
    });

    return () => {
      VoiceUtil.destroyRecognizer();
    };
  }, []);

  const startSpeech = () => {
    if (!onRecording) {
      VoiceUtil.startListening();
      setOnRecording(true); // 녹음 시작 상태로 설정
      setIsRecording(false); // 녹음해야 하는 상태로 설정
    } else {
      VoiceUtil.stopListening();
      setOnRecording(false); // 녹음 중지 상태로 설정
    }
  };

  const reRecording = () => {
    setAnswer(''); // 답변 초기화
    setIsRecording(false); // 녹음해야 하는 상태로 설정
    setOnRecording(false); // 녹음 중지 상태로 설정
  };

  const nextStep = () => {
    Alert.alert('선호도 입력 완료');
    // 다음 단계로 이동하거나 서버로 전송하는 로직 추가
  };

  return (
    <View style={styles.container}>
      <LogoLeftTop />
      <Title>주인공이 누구인가요?</Title>
      <View style={styles.mainContainer}>
        <View style={styles.logContainer}>
          <Text style={styles.questionText}>대화 로그</Text>
        </View>
        <View style={styles.conversationContainer}>
          <View style={styles.aiConversationContainer}>
            <Text style={styles.conversationText}>AI 대답</Text>
          </View>
          <View style={styles.agnetConversationContainer}>
            <Image
              source={require('../../assets/Agent.png')}
              style={[styles.agent]}
              resizeMode="contain"
            />
            <View style={styles.kidConversationContainer}>
              <Text style={styles.conversationText}>
                {isRecording ? answer : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.recordButton} onPress={startSpeech}>
        <Text style={styles.buttonText}>
          {onRecording ? '말하는 중...' : '말하기'}
        </Text>
      </TouchableOpacity>
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
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 300,
    height: '80%',
    width: '90%',
  },
  logContainer: {
    borderRadius: 15,
    backgroundColor: '#fff',
    height: '80%',
    width: '20%',
    alignItems: 'center',
  },
  conversationContainer: {
    height: '80%',
    width: '70%',
  },
  recordButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderWidth: 1,
  },
  aiConversationContainer: {
    width: '100%',
    height: '45%',
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kidConversationContainer: {
    width: '65%',
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agnetConversationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '40%',
    marginTop: '5%',
  },
  agent: {
    width: 200,
    height: 200,
  },
  conversationText: {fontSize: 30},
});

export default ProtagonistCreatingScreen;
