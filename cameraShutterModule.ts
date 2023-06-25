import {NativeModules} from 'react-native';

const {CameraShutterModule} = NativeModules;

interface CameraShutterInterface {
  playShutterSound(volumeSize: number): void;
}

export default CameraShutterModule as CameraShutterInterface;
