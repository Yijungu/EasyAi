import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import {useWebSocket} from '../contexts/WebSocketContext';

const ScreenShareScreen = () => {
  const {remoteStreams} = useWebSocket();
  const [stream, setStream] = useState(null);

  useEffect(() => {
    console.log('remoteStreams:', remoteStreams);
    const firstPeerId = Object.keys(remoteStreams)[0];
    const newStream = firstPeerId ? remoteStreams[firstPeerId] : null;
    setStream(newStream);

    if (newStream) {
      console.log('stream.toURL():', newStream.toURL());
      newStream.getTracks().forEach(track => {
        console.log(
          'Track kind:',
          track.kind,
          'Track enabled:',
          track.enabled,
          'Track readyState:',
          track.readyState,
        );
      });
    } else {
      console.log('No stream found for the first peer ID.');
    }
  }, [remoteStreams]);

  useEffect(() => {
    if (stream) {
      console.log('Updated stream.toURL():', stream.toURL());
    }
  }, [stream]);

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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

export default ScreenShareScreen;
