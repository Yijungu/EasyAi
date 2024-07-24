import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {useWebSocket} from '../../contexts/WebSocketContext';

const TeamModal = ({isVisible, onClose, onFinish}) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const {newUsers} = useWebSocket();

  useEffect(() => {
    setAvailableUsers(newUsers);
  }, [newUsers]);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      setTeams([...teams, {name: newTeamName, members: []}]);
      setNewTeamName('');
    }
  };

  const handleAddMemberToTeam = (teamIndex, user) => {
    const newTeams = [...teams];
    newTeams[teamIndex].members.push(user);
    setTeams(newTeams);
    setAvailableUsers(availableUsers.filter(u => u.id !== user.id));
  };

  const handleRemoveMemberFromTeam = (teamIndex, userId) => {
    const newTeams = [...teams];
    const removedMember = newTeams[teamIndex].members.find(
      member => member.id === userId,
    );
    newTeams[teamIndex].members = newTeams[teamIndex].members.filter(
      member => member.id !== userId,
    );
    setTeams(newTeams);
    setAvailableUsers([...availableUsers, removedMember]);
  };

  const handleUserPress = user => {
    if (selectedTeamIndex !== null) {
      handleAddMemberToTeam(selectedTeamIndex, user);
    }
  };

  const handleTeamPress = index => {
    setSelectedTeamIndex(index);
  };

  const renderUser = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}>
      <View style={styles.card}>
        <Text style={styles.userName}>{item.nickname}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTeam = ({item, index}) => (
    <TouchableOpacity onPress={() => handleTeamPress(index)}>
      <View
        style={[
          styles.teamItem,
          selectedTeamIndex === index && styles.selectedTeamItem,
        ]}>
        <Text style={styles.teamName}>{item.name}</Text>
        <FlatList
          data={item.members}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.teamMember}
              onPress={() => handleRemoveMemberFromTeam(index, item.id)}>
              <View style={styles.card}>
                <Text style={styles.userName}>{item.nickname}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={member => member.id}
          horizontal={true}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.usersContainer}>
          <Text style={styles.title}>Available Users</Text>
          <FlatList
            data={availableUsers}
            renderItem={renderUser}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.teamsContainer}>
          <Text style={styles.title}>Create Teams</Text>
          <FlatList
            data={teams}
            renderItem={renderTeam}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            value={newTeamName}
            onChangeText={setNewTeamName}
            onSubmitEditing={handleAddTeam}
            placeholder="Enter team name"
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
            <Text style={styles.addButtonText}>Add Team</Text>
          </TouchableOpacity>
          <View style={styles.closeButtonBox}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => onFinish(teams)}>
              <Text style={styles.closeButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
  },
  usersContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    padding: 16,
  },
  teamsContainer: {
    flex: 2,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    marginBottom: 12,
  },
  teamItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  selectedTeamItem: {
    borderColor: '#007bff',
    backgroundColor: '#e0f7ff',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamMember: {
    marginRight: 10,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TeamModal;
