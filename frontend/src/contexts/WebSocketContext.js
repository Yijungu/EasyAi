import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}) => {
  const [status, setStatus] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [qrCodes, setQrCodes] = useState({qrCode1: '', qrCode2: ''});
  const [mode, setModeState] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    if (affiliation) {
      ws.current = new WebSocket(
        `ws://localhost:3000/ws/${affiliation}/teacher`,
      );
      ws.current.onopen = () => {
        setStatus('WebSocket connection established');
      };
      ws.current.onmessage = event => {
        const data = JSON.parse(event.data);
        setStatus(`Received message: ${JSON.stringify(data)}`);
        if (data.type === 'mode') {
          setStatus(`Mode set to ${data.mode}`);
          if (data.sharing) {
            startScreenSharing(data.targetId);
          }
        } else if (data.type === 'screenShare') {
          // Screen share handling
        } else if (data.type === 'stopScreenShare') {
          // Stop screen share handling
        }
      };
      ws.current.onclose = () => {
        setStatus('WebSocket connection closed');
      };
      ws.current.onerror = error => {
        setStatus(`WebSocket error: ${error.message}`);
      };

      return () => {
        ws.current.close();
      };
    }
  }, [affiliation]);

  const setMode = mode => {
    setModeState(mode);
    if (ws.current) {
      ws.current.send(JSON.stringify({type: 'setMode', mode}));
    }
  };

  const createTeam = teams => {
    if (ws.current) {
      ws.current.send(JSON.stringify({type: 'createTeam', teams}));
    }
  };

  const startScreenSharing = targetId => {
    navigator.mediaDevices
      .getDisplayMedia({video: true})
      .then(stream => {
        const videoTrack = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);

        setInterval(async () => {
          const bitmap = await imageCapture.grabFrame();
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          if (ws.current) {
            ws.current.send(
              JSON.stringify({
                type: 'shareScreen',
                image: dataUrl,
                targetType: targetId,
              }),
            );
          }
        }, 1000);
      })
      .catch(error => {
        console.error('Error starting screen share:', error);
        setStatus(`Error starting screen share: ${error.message}`);
      });
  };

  return (
    <WebSocketContext.Provider
      value={{
        status,
        setMode,
        createTeam,
        setAffiliation,
        qrCodes,
        setQrCodes,
        mode,
      }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
