import {useWebSocket} from '../contexts/WebSocketContext';

export const setMode = mode => {
  const {teacherWs} = useWebSocket();
  if (teacherWs.current) {
    teacherWs.current.send(JSON.stringify({type: 'setMode', mode}));
  }
};

export const createTeam = teams => {
  const {teacherWs} = useWebSocket();
  if (teacherWs.current) {
    teacherWs.current.send(JSON.stringify({type: 'createTeam', teams}));
  }
};

export const startScreenSharing = targetId => {
  const {teacherWs} = useWebSocket();
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
        if (teacherWs.current) {
          teacherWs.current.send(
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
      if (teacherWs.current) {
        teacherWs.current.send(
          JSON.stringify({
            type: 'error',
            message: `Error starting screen share: ${error.message}`,
          }),
        );
      }
    });
};
