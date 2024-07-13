import 'react-native-gesture-handler';
import React from 'react';
import {WebSocketProvider} from './src/contexts/WebSocketContext';
import AppNavigator from './src/navigator/AppNavigator';

const App = () => {
  return (
    <WebSocketProvider>
      <AppNavigator />
    </WebSocketProvider>
  );
};

export default App;
