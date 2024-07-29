import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';
import LogoLeftTop from '../components/LogoLeftTop';
import Title from '../components/Title';
import TeamModal from '../components/Team/TeamModal';

const ModeSelectionScreen = ({navigation}) => {
  const {setMode} = useWebSocket();
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSetMode = mode => {
    setSelectedMode(mode);

    if (mode === 'team') {
      setTeamModalVisible(true);
    } else {
      setMode(mode);
    }
  };

  const handleActionButtonPress = () => {
    if (selectedMode) {
      handleSetMode(selectedMode);
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
        {['teacher', 'team', 'personal'].map((mode, index) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              selectedMode === mode && styles.selectedModeButton,
              {
                top: selectedMode === mode ? -220 : -200,
                left: index * 370 + 20 + (selectedMode === mode ? -15 : 0),
              }, // Adjusting the positions for each button
              ,
            ]}
            onPress={() => setSelectedMode(mode)}>
            <Text
              style={[
                styles.buttonText,
                selectedMode === mode && styles.selectedButtonText,
              ]}>
              {mode === 'teacher' && '선생님과 함께'}
              {mode === 'team' && '친구들과 함께'}
              {mode === 'personal' && '스스로'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TeamModal
        isVisible={teamModalVisible}
        onClose={() => setTeamModalVisible(false)}
        onFinish={teamSet}
      />
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleActionButtonPress}>
        <Text style={styles.actionButtonText}>Start</Text>
      </TouchableOpacity>
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
    // justifyContent: 'space-around',
    alignItems: 'center',
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
    width: 300,
    height: 400,
    marginHorizontal: 10,
    position: 'absolute',
  },
  selectedModeButton: {
    position: 'absolute',
    width: 330,
    height: 440,
  },
  buttonText: {
    fontSize: 25,
    marginBottom: 10,
    color: '#000',
  },
  selectedButtonText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 20,
    backgroundColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    color: '#FFF',
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
