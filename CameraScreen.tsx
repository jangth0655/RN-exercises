import {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
  check,
  request,
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

  const takePhoto = async () => {
    CameraShutterModule.playShutterSound(20);
    const result = await camera.current?.takePhoto();
    if (result?.path) {
      setPath(result?.path);
    }
    return result;
  };

  const checkPermission = useCallback(async () => {
    const permission = await check(PERMISSIONS.ANDROID.CAMERA);
    switch (permission) {
      case RESULTS.GRANTED:
        setPermissionState(RESULTS.GRANTED);
        break;
      case RESULTS.DENIED:
        const state = await request(PERMISSIONS.ANDROID.CAMERA);
        if (state === RESULTS.GRANTED) {
          setPermissionState(state);
        } else {
          return;
        }
        break;
      case RESULTS.UNAVAILABLE:
      case RESULTS.LIMITED:
      case RESULTS.GRANTED:
      case RESULTS.BLOCKED:
        setPermissionState('unavailable');
        handleCloseCamera();
        break;
    }
  }, [handleCloseCamera]);

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
