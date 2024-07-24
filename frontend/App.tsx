import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import requestPermissionsAndStartService from './src/services/PermissionsService';

const App = () => {
  useEffect(() => {
    requestPermissionsAndStartService();
  }, []);

  return <AppNavigator />;
};

export default App;
