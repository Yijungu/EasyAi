import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const TeamForm = ({index, team, onTeamChange}) => {
  return (
    <View style={styles.container}>
      <Text>Team {index + 1}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Team Name"
        value={team.name}
        onChangeText={text => onTeamChange(index, 'name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Team Members (comma separated)"
        value={team.members}
        onChangeText={text => onTeamChange(index, 'members', text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default TeamForm;
