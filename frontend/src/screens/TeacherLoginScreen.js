import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {login} from '../services/api';
import LogoCenter from '../components/LogoCenter';
import {useWebSocket} from '../contexts/WebSocketContext';

const TeacherLoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('teacher@example.com');
  const {setNewUsers, setAffiliation, setNickname, affiliationId} =
    useWebSocket();

  const handleLogin = async () => {
    try {
      setNickname('teacher');
      const data = await login(email);
      setAffiliation(data.affiliation);
      affiliationId.current = data.affiliationId;
      setNewUsers(data.newUsers);
      navigation.navigate('Main', {email, affiliation: data.affiliation});
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LogoCenter />
      <Text>Teacher Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Teacher Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Login and Generate QR Codes" onPress={handleLogin} />
      <Button title="Back" onPress={() => navigation.goBack()} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default TeacherLoginScreen;
