import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import TeamModal from '../components/Team/TeamModal';

const ModeSelectionScreen = ({navigation}) => {
  const {setMode} = useWebSocket();
  const [teamModalVisible, setTeamModalVisible] = useState(false); // useState 사용 방법 수정

  const handleSetMode = mode => {
    if (mode === 'team') {
      setTeamModalVisible(true);
    } else {
      setMode(mode);
    }
  };

  const teamSet = teams => {
    setMode('team', teams);
    console.log(teams);
    setTeamModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <LogoLeftTop />
      <Title>누구와 해볼까요?</Title>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => handleSetMode('teacher')}>
          <Text style={styles.buttonText}>선생님과 함께</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => handleSetMode('team')}>
          <Text style={styles.buttonText}>친구들과 함께</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => handleSetMode('personal')}>
          <Text style={styles.buttonText}>스스로</Text>
        </TouchableOpacity>
      </View>
      <TeamModal
        isVisible={teamModalVisible}
        onClose={() => setTeamModalVisible(false)}
        onFinish={teamSet}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 100,
  },
  modeButton: {
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 315,
    height: 420,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 25,
    color: '#000',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModeSelectionScreen;
