import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {REACT_APP_WS_URL} from '@env';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {useNavigation} from '@react-navigation/native';

const WebSocketContext = createContext(null);
console.log('13', REACT_APP_WS_URL);

export const WebSocketProvider = ({children}) => {
  const [status, setStatus] = useState('');
  // const [affiliationId, setAffiliationId] = useState(null);
  const [affiliation, setAffiliation] = useState('');
  const [qrCodes, setQrCodes] = useState({qrCode1: '', qrCode2: ''});
  const [mode, setMode] = useState('');
  const [nickname, setNickname] = useState('');
  const [newUsers, setNewUsers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [teams, setTeams] = useState([]);
  const [start, setStart] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const ws = useRef(null);
  const affiliationId = useRef(null);
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const navigation = useNavigation();
  const [connectedPeers, setConnectedPeers] = useState({});
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState([]);

  const configuration = {
    iceServers: [
      {
        urls: 'stun:stun.relay.metered.ca:80',
      },
      {
        urls: 'turn:global.relay.metered.ca:80',
        username: '036231a9432bfa410c170ae3',
        credential: 'xIq93HnmKL0Eniyi',
      },
      {
        urls: 'turn:global.relay.metered.ca:80?transport=tcp',
        username: '036231a9432bfa410c170ae3',
        credential: 'xIq93HnmKL0Eniyi',
      },
      {
        urls: 'turn:global.relay.metered.ca:443',
        username: '036231a9432bfa410c170ae3',
        credential: 'xIq93HnmKL0Eniyi',
      },
      {
        urls: 'turns:global.relay.metered.ca:443?transport=tcp',
        username: '036231a9432bfa410c170ae3',
        credential: 'xIq93HnmKL0Eniyi',
      },
    ],
    iceTransportPolicy: 'all',
  };

  useEffect(() => {
    if (affiliation && nickname) {
      ws.current = new WebSocket(
        `${REACT_APP_WS_URL}/ws/${affiliation}/${nickname}`,
      );
      ws.current.onopen = () => {
        setStatus('WebSocket connection established');
      };
      ws.current.onmessage = async event => {
        const data = JSON.parse(event.data);
        console.log(`Received message: ${JSON.stringify(data)}`);

        switch (data.type) {
          case 'mode':
            if (data.state === 'manage') {
              if (data.mode === 'personal') {
                const userIds = data.newUsers.map(user => user.id);
                console.log(data.newUsers);
                await initializePeerConnections(userIds);
              } else if (data.mode === 'team') {
                const teamLeaderIds = data.teams.map(
                  team => team.members[0].id,
                );
                await initializePeerConnections(teamLeaderIds);
              }
            }
            if (data.sharing && data.targetIds.length > 0) {
              console.log(data.targetIds.length);
              startScreenSharing(data.targetIds);
            }
            break;
          case 'newUser':
            setNewUsers(prevUsers => [...prevUsers, data.newUser]);
            break;
          case 'offer':
            await handleOffer(data.offer, data.from);
            break;
          case 'answer':
            await handleAnswer(data.answer, data.from);
            break;
          case 'candidate':
            await handleIceCandidate(data.candidate, data.from);
            break;
          case 'completed':
            handleComplete(data.state);
            break;
          case 'startScreenSharing':
            startScreenSharingOnly(data.from);
            break;
          case 'stopScreenShareSender':
            stopScreenSharingOnlySender(data.from, data.newUserId);
            break;
          case 'stopScreenShareSenderCompleted':
            requestSharing(data.newUserId);
            break;
          case 'stopScreenShare':
            stopScreenSharing();
            break;
          case 'userDisconnected':
            handleUserDisconnected(data.userId);
            break;
          case 'libraryStart':
            handleLibraryStart(data.stories);
            break;
          case 'creatingBook':
            handleCreatingBook(data.story);
            break;
          default:
            console.warn(`Unknown message type (frontend): ${data.type}`);
        }
      };
      ws.current.onclose = () => {
        setStatus('WebSocket connection closed');
        // Close all peer connections when WebSocket is closed
        Object.keys(peerConnections.current).forEach(peerId => {
          if (peerConnections.current[peerId]) {
            peerConnections.current[peerId].close();
            delete peerConnections.current[peerId];
          }
        });
        setRemoteStreams({});
        setConnectedPeers({});
      };
      ws.current.onerror = error => {
        setStatus(`WebSocket error: ${error.message}`);
      };

      return () => {
        ws.current.close();
      };
    }
  }, [affiliation, nickname]);

  const logStats = async (pc, targetId) => {
    const stats = await pc.getStats();
    stats.forEach(report => {
      if (report.type === 'candidate-pair' && report.state === 'failed') {
        console.log(`Candidate Pair failed for peer ${targetId}:`, report);
      }
      if (
        report.type === 'local-candidate' ||
        report.type === 'remote-candidate'
      ) {
        console.log(`Candidate details for peer ${targetId}:`, report);
      }
    });
  };

  const requestSharing = userId => {
    if (ws.current) {
      ws.current.send(
        JSON.stringify({type: 'startScreenSharing', targetType: userId}),
      );
    }
  };

  const setModeAndNotify = (mode, teams) => {
    setMode(mode);
    navigation.navigate('SetModeLoading');
    if (mode === 'team') {
      setTeams(teams);
      if (ws.current) {
        ws.current.send(JSON.stringify({type: 'setModeAndTeams', mode, teams}));
      }
    } else {
      if (ws.current) {
        ws.current.send(JSON.stringify({type: 'setMode', mode, newUsers}));
      }
    }
  };

  const createTeam = teams => {
    if (ws.current) {
      ws.current.send(JSON.stringify({type: 'createTeam', teams}));
    }
  };

  const initializePeerConnections = async targetIds => {
    try {
      for (const targetId of targetIds) {
        if (!peerConnections.current[targetId]) {
          const pc = createPeerConnection(targetId);
          peerConnections.current[targetId] = pc;

          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.current.send(
            JSON.stringify({
              type: 'offer',
              offer: pc.localDescription,
              targetType: targetId,
            }),
          );
        }
      }
    } catch (error) {
      console.error('Error initializing peer connections:', error);
      setStatus(`Error initializing peer connections: ${error.message}`);
    }
  };

  const stopScreenSharingOnlyReciver = (senderId, newUserId) => {
    //로딩창 띄움
    const pc = peerConnections.current[senderId];
    console.log(senderId);
    if (pc) {
      pc.getReceivers().forEach(receiver => {
        if (receiver.track) {
          receiver.track.stop();
        }
      });

      // Remove the stream from remoteStreams
      setRemoteStreams(prevStreams => {
        const newStreams = {...prevStreams};
        delete newStreams[senderId];
        return newStreams;
      });

      ws.current.send(
        JSON.stringify({
          type: 'stopScreenShareSender',
          newUserId,
          targetType: senderId,
        }),
      );
    }
  };

  const stopScreenSharingOnlySender = (targetId, newUserId) => {
    const pc = peerConnections.current[targetId];
    if (pc && localStream.current) {
      const senders = pc.getSenders();
      localStream.current.getTracks().forEach(track => {
        senders.forEach(sender => {
          if (sender.track && sender.track.id === track.id) {
            pc.removeTrack(sender);
          }
        });
      });

      // Stop local tracks
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;

      ws.current.send(
        JSON.stringify({
          type: 'stopScreenShareCompleted',
          newUserId,
          targetType: targetId,
        }),
      );
    }
  };

  const startScreenSharingOnly = async targetId => {
    try {
      const stream = await mediaDevices.getDisplayMedia({video: true});
      localStream.current = stream;
      if (!peerConnections.current[targetId]) {
        peerConnections.current[targetId] = createPeerConnection(targetId);
      }

      const pc = peerConnections.current[targetId];
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current);
      });

      // 네고시에이션 플래그 설정
      pc.isNegotiating = true;

      // Offer 생성 및 전송
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.current.send(
        JSON.stringify({
          type: 'offer',
          offer: pc.localDescription,
          targetType: targetId,
        }),
      );

      // 네고시에이션 플래그 해제
      pc.isNegotiating = false;
    } catch (error) {
      console.error('Error starting screen share:', error);
      setStatus(`Error starting screen share: ${error.message}`);
    }
  };

  const startScreenSharing = async targetIds => {
    try {
      const stream = await mediaDevices.getDisplayMedia({video: true});
      localStream.current = stream;
      targetIds.forEach(targetId => {
        if (!peerConnections.current[targetId]) {
          peerConnections.current[targetId] = createPeerConnection(targetId);
        }

        const pc = peerConnections.current[targetId];
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // 네고시에이션 플래그 설정
        pc.isNegotiating = true;

        // Offer 생성 및 전송
        pc.createOffer()
          .then(offer => {
            return pc.setLocalDescription(offer);
          })
          .then(() => {
            ws.current.send(
              JSON.stringify({
                type: 'offer',
                offer: pc.localDescription,
                targetType: targetId,
              }),
            );
          })
          .catch(error => {
            console.error('Error during negotiation:', error);
          })
          .finally(() => {
            // 네고시에이션 플래그 해제
            pc.isNegotiating = false;
          });
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
      setStatus(`Error starting screen share: ${error.message}`);
    }
  };

  const stopScreenSharing = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    Object.keys(peerConnections.current).forEach(peerId => {
      if (peerConnections.current[peerId]) {
        peerConnections.current[peerId].close();
      }
    });
    setStatus('Screen sharing stopped');
  };

  const createPeerConnection = targetId => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log(
          `Sending ICE candidate to peer ${targetId}:`,
          event.candidate,
        );
        ws.current.send(
          JSON.stringify({
            type: 'candidate',
            candidate: event.candidate,
            targetType: targetId,
          }),
        );
      }
    };

    pc.ontrack = event => {
      setRemoteStreams(prevStreams => ({
        ...prevStreams,
        [targetId]: event.streams[0],
      }));
    };

    pc.oniceconnectionstatechange = () => {
      console.log(
        `ICE Connection State for peer ${targetId}: ${pc.iceConnectionState}`,
      );
      if (
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'disconnected'
      ) {
        logStats(pc, targetId); // 추가된 부분
        console.warn(
          `ICE connection state changed to ${pc.iceConnectionState} for peer ${targetId}`,
        );
        updateConnectedPeers(targetId, false);
      } else if (pc.iceConnectionState === 'completed') {
        ws.current.send(
          JSON.stringify({
            type: 'completed',
            targetType: targetId,
          }),
        );
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(
        `Connection State for peer ${targetId}: ${pc.connectionState}`,
      );
      if (
        pc.connectionState === 'failed' ||
        pc.connectionState === 'disconnected'
      ) {
        logStats(pc, targetId); // 추가된 부분
        console.warn(
          `Connection state changed to ${pc.connectionState} for peer ${targetId}`,
        );
        updateConnectedPeers(targetId, false);
      }
    };

    pc.onsignalingstatechange = () => {
      console.log(`Signaling State for peer ${targetId}: ${pc.signalingState}`);
      if (pc.signalingState === 'closed') {
        logStats(pc, targetId); // 추가된 부분
        console.warn(
          `Signaling state changed to ${pc.signalingState} for peer ${targetId}`,
        );
        updateConnectedPeers(targetId, false);
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log(`Sending offer to peer ${targetId}`);
        ws.current.send(
          JSON.stringify({
            type: 'offer',
            offer,
            targetType: targetId,
          }),
        );
      } catch (error) {
        console.error('Error during negotiation:', error);
      }
    };

    return pc;
  };

  const handleOffer = async (offer, from) => {
    try {
      if (!peerConnections.current[from]) {
        peerConnections.current[from] = createPeerConnection(from);
      }
      console.log(`Received offer from peer ${from}`);
      await peerConnections.current[from].setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnections.current[from].createAnswer();
      await peerConnections.current[from].setLocalDescription(answer);
      console.log(`Sending answer to peer ${from}`);
      ws.current.send(
        JSON.stringify({type: 'answer', answer, targetType: from}),
      );
      updateConnectedPeers(from, true);
    } catch (error) {
      console.error('Error handling offer:', error);
      setStatus(`Error handling offer: ${error.message}`);
    }
  };

  const screenShareManage = async (oldUser, newUser) => {
    if (oldUser) {
      stopScreenSharingOnlyReciver(oldUser.id, newUser.id);
      return;
    }
    requestSharing(newUser.id);
  };

  const handleAnswer = async (answer, from) => {
    try {
      console.log(`Received answer from peer ${from}`);
      await peerConnections.current[from].setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      updateConnectedPeers(from, true);
    } catch (error) {
      console.error('Error handling answer:', error);
      setStatus(`Error handling answer: ${error.message}`);
    }
  };

  const handleIceCandidate = async (candidate, from) => {
    try {
      console.log(`Received ICE candidate from peer ${from}:`, candidate);
      peerConnections.current[from].addIceCandidate(
        new RTCIceCandidate(candidate),
      );
      updateConnectedPeers(from, true);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      setStatus(`Error handling ICE candidate: ${error.message}`);
    }
  };

  const updateConnectedPeers = (id, isConnected) => {
    setConnectedPeers(prevPeers => {
      const newPeers = {...prevPeers};
      if (isConnected) {
        newPeers[id] = true;
      } else {
        delete newPeers[id];
      }
      return newPeers;
    });
  };

  const handleComplete = state => {
    if (start === false) {
      if (state === 'manage') {
        navigation.navigate('ScreenShareManager');
      } else if (state === 'personal') {
        console.log('affiliationId : ', affiliationId.current);
        ws.current.send(
          JSON.stringify({
            type: 'librarySetting',
            affiliationId: affiliationId.current,
          }),
        );
        // navigation.navigate('Library');
      } else if (state === 'shared') {
        navigation.navigate('ScreenShare');
      }
      setStart(true);
    }
  };

  const handleUserDisconnected = userId => {
    // Check if the disconnected user is the teacher
    if (nickname === 'teacher') {
      setNewUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      console.log('Teacher has disconnected');
    } else {
      // Handle non-teacher disconnection
      console.log(`User ${userId} has disconnected`);

      // Close the peer connection and remove all tracks
      if (peerConnections.current[userId]) {
        const pc = peerConnections.current[userId];

        // Remove all senders' tracks
        const senders = pc.getSenders();
        senders.forEach(sender => pc.removeTrack(sender));

        // Close the peer connection
        pc.close();

        // Delete the peer connection from the reference
        delete peerConnections.current[userId];

        // Remove remote streams
        setRemoteStreams(prevStreams => {
          const newStreams = {...prevStreams};
          delete newStreams[userId];
          return newStreams;
        });

        // Remove from connected peers
        setConnectedPeers(prevPeers => {
          const newPeers = {...prevPeers};
          delete newPeers[userId];
          return newPeers;
        });
      }
    }
  };

  const handleLibraryStart = stories => {
    // Check if the disconnected user is the teacher
    setStories(stories);
    navigation.navigate('Library');
  };

  const creatingBook = (depth, questionCount, extensionEnabled) => {
    setLoadingModalVisible(true);
    ws.current.send(
      JSON.stringify({
        type: 'creatingBook',
        affiliationId: affiliationId.current,
        depth,
        questionCount,
        extensionEnabled,
      }),
    );
  };

  const handleCreatingBook = story => {
    // Check if the disconnected user is the teacher
    setCurrentStory(story);
    setLoadingModalVisible(false);
    console.log(11111);
    navigation.navigate('ProtagonistDrawing');
  };

  return (
    <WebSocketContext.Provider
      value={{
        status,
        setMode: setModeAndNotify,
        createTeam,
        setAffiliation,
        qrCodes,
        setQrCodes,
        mode,
        setNickname,
        newUsers,
        setNewUsers,
        startScreenSharing,
        stopScreenSharing,
        remoteStreams,
        teams,
        screenShareManage,
        affiliationId,
        stories,
        creatingBook,
        loadingModalVisible,
      }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
