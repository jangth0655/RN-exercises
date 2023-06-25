package com.nativepractice;
import android.media.SoundPool;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class CameraShutterModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "CameraShutterModule";
    private SoundPool soundPool;
    private int shutterSoundId;

    public CameraShutterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }


    public void prepareShutterSound(){
        if(soundPool == null){
            soundPool = new SoundPool.Builder().setMaxStreams(1).build();
            shutterSoundId = soundPool.load(getReactApplicationContext(), R.raw.shutter_sound, 1);
            Log.d(MODULE_NAME, "Shutter sound ID: " + shutterSoundId);
        }
    }


    @ReactMethod
    public void playShutterSound(int volumeSize) {
        Log.d(MODULE_NAME, "volumeSize: " + volumeSize);
        prepareShutterSound();

        float volume = (float) volumeSize / 100.0f;
        soundPool.play(shutterSoundId, volume, volume, 1, 0, 1);
    }


}
