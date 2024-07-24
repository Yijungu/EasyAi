import {
  PermissionsAndroid,
  Platform,
  NativeModules,
  Linking,
} from 'react-native';
import {Alert} from 'react-native';

// Function to request permissions and start ScreenShareService
async function requestPermissionsAndStartService() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);

      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the microphone and camera');

        // SYSTEM_ALERT_WINDOW 권한 요청
        const systemAlertWindowGranted =
          await requestSystemAlertWindowPermission();
        if (systemAlertWindowGranted) {
          // Start the ScreenShareService
          if (
            NativeModules.ScreenShareService &&
            NativeModules.ScreenShareService.start
          ) {
            NativeModules.ScreenShareService.start();
            console.log('ScreenShareService module start');
          } else {
            console.warn('ScreenShareService module is not available');
          }
        } else {
          console.log('SYSTEM_ALERT_WINDOW permission denied');
          Alert.alert(
            'Permission Required',
            "Please enable 'Draw over other apps' permission in settings to use screen share.",
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ],
          );
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    console.log('iOS does not require manual permissions request');
  }
}

async function requestSystemAlertWindowPermission() {
  if (Platform.OS === 'android') {
    try {
      const isGranted = await NativeModules.SystemAlertWindowPermission.check();
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return false;
}

export default requestPermissionsAndStartService;
