import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import {useWebSocket} from '../contexts/WebSocketContext';

const ScreenShareManagerScreen = () => {
  const {mode, newUsers, teams, remoteStreams, screenShareManage} =
    useWebSocket();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelection = async newUser => {
    screenShareManage(selectedUser, newUser);
    setSelectedUser(newUser);
  };

  useEffect(() => {
    if (selectedUser) {
      const newStream = remoteStreams[selectedUser.id];
      if (newStream) {
        setStream(newStream);
      } else {
        setStream(null);
      }
    }
  }, [selectedUser, remoteStreams]);

  const [stream, setStream] = useState(null);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleUserSelection(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const getData = () => {
    if (mode === 'personal') {
      return newUsers.map(user => ({id: user.id, name: user.nickname}));
    } else if (mode === 'team') {
      console.log(teams);
      return teams.map(team => ({
        id: team.members[0].id, // 각 팀의 첫 번째 멤버의 ID 사용
        name: `${team.name} - ${team.members[0].nickname}`,
      }));
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={getData()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.screenContainer}>
        {stream ? (
          <RTCView
            streamURL={stream.toURL()}
            style={styles.video}
            objectFit="cover"
            mirror={false} // Set mirror to false for screen sharing
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Text>No video stream available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    padding: 10,
  },
  screenContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  video: {
    width: '80%',
    height: '80%',
    backgroundColor: '#000000', // Changed to black to contrast with video
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default ScreenShareManagerScreen;
