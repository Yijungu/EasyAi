import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginSelectionScreen from '../screens/LoginSelectionScreen';
import TeacherLoginScreen from '../screens/TeacherLoginScreen';
import ChildLoginScreen from '../screens/ChildLoginScreen';
import MainScreen from '../screens/MainScreen';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import {WebSocketProvider} from '../contexts/WebSocketContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <WebSocketProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginSelection">
          <Stack.Screen
            name="LoginSelection"
            component={LoginSelectionScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={TeacherLoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChildLogin"
            component={ChildLoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ModeSelection"
            component={ModeSelectionScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WebSocketProvider>
  );
};

export default AppNavigator;
