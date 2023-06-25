import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import CameraScreen from './CameraScreen';

function App() {
  const [isOnCamera, setIsOnCamera] = useState(false);

  const handleOpenCamera = useCallback(() => {
    setIsOnCamera(true);
  }, []);
  const handleCloseCamera = useCallback(() => {
    setIsOnCamera(false);
  }, []);

  const onPress = () => {
    handleOpenCamera();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Pressable onPress={onPress}>
          <Text style={styles.buttonText}>캘린더 모듈</Text>
        </Pressable>
      </View>
      {isOnCamera && <CameraScreen handleCloseCamera={handleCloseCamera} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    flex: 1,
  },
  buttonWrapper: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: '#fff',
  },
});

export default App;
