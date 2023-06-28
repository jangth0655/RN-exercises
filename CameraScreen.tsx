import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
  check,
  checkMultiple,
  openSettings,
  request,
  requestMultiple,
} from 'react-native-permissions';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import CameraShutterModule from './cameraShutterModule';

type Props = {
  handleCloseCamera: () => void;
};

const {width} = Dimensions.get('window');
const marginHorizontal = width * 0.1;

export default function CameraScreen({handleCloseCamera}: Props) {
  const [permissionState, setPermissionState] =
    useState<PermissionStatus>('denied');
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const [path, setPath] = useState('');
  const [isSlience, setIsSlience] = useState(false);

  const takePhoto = async () => {
    console.log(isSlience);
    CameraShutterModule.playShutterSound(isSlience ? 0 : 100);
    const result = await camera.current?.takePhoto();
    if (result?.path) {
      setPath(result?.path);
    }
    return result;
  };

  const handleSilenceCamera = useCallback(() => {
    setIsSlience(prev => !prev);
  }, []);

  const requsetMultiplePermission = useCallback(async () => {
    const multiplePermission = await requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ]);
    return (
      multiplePermission['android.permission.CAMERA'] ||
      multiplePermission['android.permission.READ_MEDIA_AUDIO']
    );
  }, []);

  const checkPermission = useCallback(async () => {
    const permission = await requsetMultiplePermission();
    switch (permission) {
      case RESULTS.GRANTED:
        setPermissionState(RESULTS.GRANTED);
        break;
      case RESULTS.DENIED:
        const state = await requsetMultiplePermission();
        if (state === 'granted') {
          console.log('state', state);
        }
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
      case RESULTS.LIMITED:
      case RESULTS.GRANTED:
        Alert.alert('권한 거부', '카메라 및 오디오 권한을 설정해주세요.', [
          {
            text: '설정 열기',
            onPress: async () => await openSettings(),
          },
        ]);
        setPermissionState('unavailable');
        handleCloseCamera();
        break;
    }
  }, [handleCloseCamera, requsetMultiplePermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return (
    <View style={styles.container}>
      {device && permissionState === 'granted' && (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />

          <View style={styles.buttonContainer}>
            <Pressable onPress={takePhoto} style={styles.cameraButton}>
              <Text style={styles.cameraText}>촬영</Text>
            </Pressable>
            <Pressable onPress={handleCloseCamera} style={styles.cameraButton}>
              <Text style={styles.cameraText}>취소</Text>
            </Pressable>
            <Pressable
              onPress={handleSilenceCamera}
              style={styles.cameraButton}>
              <Text style={styles.cameraText}>
                {isSlience ? '켜기' : '무음'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  cameraText: {
    color: '#fff',
    fontSize: 26,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  cameraButton: {
    backgroundColor: 'black',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  closeButton: {
    backgroundColor: 'black',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
  },
});
