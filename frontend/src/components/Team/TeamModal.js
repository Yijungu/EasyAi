import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, Modal} from 'react-native';
import TeamForm from './TeamForm';

const TeamModal = ({isVisible, onClose, onCreateTeam}) => {
  const [teams, setTeams] = useState([{name: '', members: ''}]);

  const handleAddTeam = () => {
    setTeams([...teams, {name: '', members: ''}]);
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = [...teams];
    newTeams[index][field] = value;
    setTeams(newTeams);
  };

  const handleCreateTeam = () => {
    const formattedTeams = teams.map(team => ({
      teamName: team.name,
      teamMembers: team.members.split(',').map(member => member.trim()),
    }));
    onCreateTeam(formattedTeams);
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Text>Create Teams</Text>
        {teams.map((team, index) => (
          <TeamForm
            key={index}
            index={index}
            team={team}
            onTeamChange={handleTeamChange}
          />
        ))}
        <Button title="Add Team" onPress={handleAddTeam} />
        <Button title="Create Teams" onPress={handleCreateTeam} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default TeamModal;
