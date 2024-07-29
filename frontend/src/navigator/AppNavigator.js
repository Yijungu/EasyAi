import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginSelectionScreen from '../screens/LoginSelectionScreen';
import TeacherLoginScreen from '../screens/TeacherLoginScreen';
import ChildLoginScreen from '../screens/ChildLoginScreen';
import MainScreen from '../screens/MainScreen';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import ScreenShareScreen from '../screens/ScreenShareScreen';
import ScreenShareManagerScreen from '../screens/ScreenShareManagerScreen'; // 추가된 스크린
import LibraryScreen from '../screens/LibraryScreen'; // 도서관 스크린 추가
import SetModeLoadingScreen from '../screens/SetModeLoadingScreen';
import CanvasLoadingScreen from '../screens/CanvasLoadingScreen';
import {WebSocketProvider} from '../contexts/WebSocketContext';
import BookCreationScreen from '../screens/BookCreationScreen';
import ProtagonistDrawingScreen from '../screens/ProtagonistDrawingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <WebSocketProvider>
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
          <Stack.Screen
            name="SetModeLoading"
            component={SetModeLoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ScreenShare"
            component={ScreenShareScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ScreenShareManager"
            component={ScreenShareManagerScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Library"
            component={LibraryScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CanvasLoading"
            component={CanvasLoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BookCreation"
            component={BookCreationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProtagonistDrawing"
            component={ProtagonistDrawingScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </WebSocketProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
