---
title: Audio
---

Provides basic sample playback and recording.

Note that Expo does not yet support backgrounding, so audio is not available to play in the background of your experience. Audio also automatically stops if headphones / bluetooth audio devices are disconnected.

Try the [playlist example app](http://expo.io/@community/playlist) (source code is [on GitHub](https://github.com/expo/playlist-example)) to see an example usage of the media playback API, and the [recording example app](http://expo.io/@community/record) (source code is [on GitHub](https://github.com/expo/audio-recording-example)) to see an example usage of the recording API.

## Enabling Audio and customizing Audio Mode

### `Expo.Audio.setIsEnabledAsync(value)`

Audio is enabled by default, but if you want to write your own Audio API in a detached app, you might want to disable the Expo Audio API.

#### Arguments

-   **value (_boolean_)** -- `true` enables Expo Audio, and `false` disables it.

#### Returns

A `Promise` that will reject if audio playback could not be enabled for the device.

### `Expo.Audio.setAudioModeAsync(mode)`

We provide this API to customize the audio experience on iOS and Android.

#### Arguments

-   **mode (_object_)** --

    A dictionary with the following key-value pairs:

    -   `playsInSilentModeIOS` : a boolean selecting if your experience's audio should play in silent mode on iOS. This value defaults to `false`.
    -   `allowsRecordingIOS` : a boolean selecting if recording is enabled on iOS. This value defaults to `false`. NOTE: when this flag is set to `true`, playback may be routed to the phone receiver instead of to the speaker.
    -   `interruptionModeIOS` : an enum selecting how your experience's audio should interact with the audio from other apps on iOS:
        - `INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS` : This is the default option. If this option is set, your experience's audio is mixed with audio playing in background apps.
        - `INTERRUPTION_MODE_IOS_DO_NOT_MIX` : If this option is set, your experience's audio interrupts audio from other apps.
        - `INTERRUPTION_MODE_IOS_DUCK_OTHERS` : If this option is set, your experience's audio lowers the volume ("ducks") of audio from other apps while your audio plays.
    -   `shouldDuckAndroid` : a boolean selecting if your experience's audio should automatically be lowered in volume ("duck") if audio from another app interrupts your experience. This value defaults to `true`. If `false`, audio from other apps will pause your audio.
    -   `interruptionModeAndroid` : an enum selecting how your experience's audio should interact with the audio from other apps on Android:
        - `INTERRUPTION_MODE_ANDROID_DO_NOT_MIX` : If this option is set, your experience's audio interrupts audio from other apps.
        - `INTERRUPTION_MODE_ANDROID_DUCK_OTHERS` : This is the default option. If this option is set, your experience's audio lowers the volume ("ducks") of audio from other apps while your audio plays.

#### Returns

A `Promise` that will reject if the audio mode could not be enabled for the device. Note that these are the only legal AudioMode combinations of (`playsInSilentModeIOS`, `allowsRecordingIOS`, `interruptionModeIOS`), and any other will result in promise rejection:
 - `false, false, INTERRUPTION_MODE_IOS_DO_NOT_MIX`
 - `false, false, INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS`
 - `true, true, INTERRUPTION_MODE_IOS_DO_NOT_MIX`
 - `true, true, INTERRUPTION_MODE_IOS_DUCK_OTHERS`
 - `true, true, INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS`
 - `true, false, INTERRUPTION_MODE_IOS_DO_NOT_MIX`
 - `true, false, INTERRUPTION_MODE_IOS_DUCK_OTHERS`
 - `true, false, INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS`

## Playing sounds

### `Expo.Audio.Sound`

This class represents a sound corresponding to an Asset or URL.

#### Returns

A newly constructed instance of `Expo.Audio.Sound`.

#### Example

```javascript
const soundObject = new Expo.Audio.Sound();
try {
  await soundObject.loadAsync(require('./assets/sounds/hello.mp3'));
  await soundObject.playAsync();
  // Your sound is playing!
} catch (error) {
  // An error occurred!
}
```

A static convenience method to construct and load a sound is also provided:

-   `Expo.Audio.Sound.create(source, initialStatus = {}, onPlaybackStatusUpdate = null, downloadFirst = true)`

    Creates and loads a sound from source, with optional `initialStatus`, `onPlaybackStatusUpdate`, and `downloadFirst`.

    This is equivalent to the following:

    ```javascript
    const soundObject = new Expo.Audio.Sound();
    soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await soundObject.loadAsync(source, initialStatus, downloadFirst);
    ```

    #### Parameters

    -   **source (_object_ / _number_ / _Asset_)** -- The source of the sound. The following forms are supported:

        -   A dictionary of the form `{ uri: 'http://path/to/file' }` with a network URL pointing to an audio file on the web.
        -   `require('path/to/file')` for an audio file asset in the source code directory.
        -   An [`Expo.Asset`](asset.html) object for an audio file asset.

    -   **initialStatus (_PlaybackStatusToSet_)** -- The initial intended `PlaybackStatusToSet` of the sound, whose values will override the default initial playback status. This value defaults to `{}` if no parameter is passed. See the [AV documentation](av.html) for details on `PlaybackStatusToSet` and the default initial playback status.

    -   **onPlaybackStatusUpdate (_function_)** -- A function taking a single parameter `PlaybackStatus`. This value defaults to `null` if no parameter is passed. See the [AV documentation](av.html) for details on the functionality provided by `onPlaybackStatusUpdate`

    -   **downloadFirst (_boolean_)** -- If set to true, the system will attempt to download the resource to the device before loading. This value defaults to `true`. Note that at the moment, this will only work for `source`s of the form `require('path/to/file')` or `Asset` objects.

    #### Returns

    A `Promise` that is rejected if creation failed, or fulfilled with the following dictionary if creation succeeded:

    -   `sound` : the newly created and loaded `Sound` object.
    -   `status` : the `PlaybackStatus` of the `Sound` object. See the [AV documentation](av.html) for further information.

    #### Example

    ```javascript
    try {
      const { soundObject, status } = await Expo.Audio.Sound.create(
        require('./assets/sounds/hello.mp3'),
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
    ```

The rest of the API for `Expo.Audio.Sound` is the same as the imperative playback API for `Expo.Video`-- see the [AV documentation](av.html) for further information:

-   `soundObject.loadAsync(source, initialStatus = {}, downloadFirst = true)`

-   `soundObject.unloadAsync()`

-   `soundObject.getStatusAsync()`

-   `soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)`

-   `soundObject.setStatusAsync(statusToSet)`

-   `soundObject.playAsync()`

-   `soundObject.pauseAsync()`

-   `soundObject.stopAsync()`

-   `soundObject.setPositionAsync(millis)`

-   `soundObject.setRateAsync(value, shouldCorrectPitch)`

-   `soundObject.setVolumeAsync(value)`

-   `soundObject.setIsMutedAsync(value)`

-   `soundObject.setIsLoopingAsync(value)`

-   `soundObject.setProgressUpdateIntervalAsync(millis)`

## Recording sounds

### `Expo.Audio.Recording`

This class represents an audio recording. After creating an instance of this class, `prepareToRecordAsync` must be called in order to record audio. Once recording is finished, call `stopAndUnloadAsync`. Note that only one recorder is allowed to exist in the state between `prepareToRecordAsync` and `stopAndUnloadAsync` at any given time.

Note that your experience must request audio recording permissions in order for recording to function. See the [`Permissions` module](./permissions.html) for more details.

#### Returns

A newly constructed instance of `Expo.Audio.Recording`.

#### Example

```javascript
const recording = new Expo.Audio.Recording();
try {
  await recording.prepareToRecordAsync(Expo.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  await recording.startAsync();
  // You are now recording!
} catch (error) {
  // An error occurred!
}
```

-   `recordingInstance.getStatusAsync()`

    Gets the `status` of the `Recording`.

    #### Returns

    A `Promise` that is resolved with the `status` of the `Recording`: a dictionary with the following key-value pairs.

    Before `prepareToRecordAsync` is called, the `status` will be as follows:

    -   `canRecord` : a boolean set to `false`.
    -   `isDoneRecording` : a boolean set to `false`.

    After `prepareToRecordAsync()` is called, but before `stopAndUnloadAsync()` is called, the `status` will be as follows:

    -   `canRecord` : a boolean set to `true`.
    -   `isRecording` : a boolean describing if the `Recording` is currently recording.
    -   `durationMillis` : the current duration of the recorded audio.

    After `stopAndUnloadAsync()` is called, the `status` will be as follows:

    -   `canRecord` : a boolean set to `false`.
    -   `isDoneRecording` : a boolean set to `true`.
    -   `durationMillis` : the final duration of the recorded audio.

-   `recordingInstance.setOnRecordingStatusUpdate(onRecordingStatusUpdate)`

    Sets a function to be called regularly with the `status` of the `Recording`. See `getStatusAsync()` for details on `status`.

    `onRecordingStatusUpdate` will be called when another call to the API for this recording completes (such as `prepareToRecordAsync()`, `startAsync()`, `getStatusAsync()`, or `stopAndUnloadAsync()`), and will also be called at regular intervals while the recording can record. Call `setProgressUpdateInterval()` to modify the interval with which `onRecordingStatusUpdate` is called while the recording can record.

    #### Parameters

    -   **onRecordingStatusUpdate (_function_)** -- A function taking a single parameter `status` (a dictionary, described in `getStatusAsync`).

-   `recordingInstance.setProgressUpdateInterval(millis)`

    Sets the interval with which `onRecordingStatusUpdate` is called while the recording can record. See `setOnRecordingStatusUpdate` for details. This value defaults to 500 milliseconds.

    #### Parameters

    -   **millis (_number_)** -- The new interval between calls of `onRecordingStatusUpdate`.

-   `recordingInstance.prepareToRecordAsync(options)`

    Loads the recorder into memory and prepares it for recording. This must be called before calling `startAsync()`. This method can only be called if the `Recording` instance has never yet been prepared.

    #### Parameters

    -   **options (_RecordingOptions_)** -- Options for the recording, including sample rate, bitrate, channels, format, encoder, and extension. If no options are passed to `prepareToRecordAsync()`, the recorder will be created with options `Expo.Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY`. See below for details on `RecordingOptions`.

    #### Returns

    A `Promise` that is fulfilled when the recorder is loaded and prepared, or rejects if this failed. If another `Recording` exists in your experience that is currently prepared to record, the `Promise` will reject. If the `RecordingOptions` provided are invalid, the `Promise` will also reject. The promise is resolved with the `status` of the recording (see `getStatusAsync()` for details).

-   `recordingInstance.isPreparedToRecord()`

    #### Returns

    A `boolean` that is true if and only if the `Recording` is prepared to record.

-   `recordingInstance.startAsync()`

    Begins recording. This method can only be called if the `Recording` has been prepared.

    #### Returns

    A `Promise` that is fulfilled when recording has begun, or rejects if recording could not start. The promise is resolved with the `status` of the recording (see `getStatusAsync()` for details).

-   `recordingInstance.pauseAsync()`

    Pauses recording. This method can only be called if the `Recording` has been prepared.

    NOTE: This is only available on Android API version 24 and later.

    #### Returns

    A `Promise` that is fulfilled when recording has paused, or rejects if recording could not be paused. If the Android API version is less than 24, the `Promise` will reject. The promise is resolved with the `status` of the recording (see `getStatusAsync()` for details).

-   `recordingInstance.stopAndUnloadAsync()`

    Stops the recording and deallocates the recorder from memory. This reverts the `Recording` instance to an unprepared state, and another `Recording` instance must be created in order to record again. This method can only be called if the `Recording` has been prepared.

    #### Returns

    A `Promise` that is fulfilled when recording has stopped, or rejects if recording could not be stopped. The promise is resolved with the `status` of the recording (see `getStatusAsync()` for details).

-   `recordingInstance.getURI()`

    Gets the local URI of the `Recording`. Note that this will only succeed once the `Recording` is prepared to record.

    #### Returns

    A `string` with the local URI of the `Recording`, or `null` if the `Recording` is not prepared to record.

-   `recordingInstance.createNewLoadedSound()`

    Creates and loads a new `Sound` object to play back the `Recording`. Note that this will only succeed once the `Recording` is done recording (once `stopAndUnloadAsync()` has been called).

    #### Parameters

    -   **initialStatus (_PlaybackStatusToSet_)** -- The initial intended `PlaybackStatusToSet` of the sound, whose values will override the default initial playback status. This value defaults to `{}` if no parameter is passed. See the [AV documentation](av.html) for details on `PlaybackStatusToSet` and the default initial playback status.

    -   **onPlaybackStatusUpdate (_function_)** -- A function taking a single parameter `PlaybackStatus`. This value defaults to `null` if no parameter is passed. See the [AV documentation](av.html) for details on the functionality provided by `onPlaybackStatusUpdate`

    #### Returns

    A `Promise` that is rejected if creation failed, or fulfilled with the following dictionary if creation succeeded:

    -   `sound` : the newly created and loaded `Sound` object.
    -   `status` : the `PlaybackStatus` of the `Sound` object. See the [AV documentation](av.html) for further information.

### `RecordingOptions`

The recording extension, sample rate, bitrate, channels, format, encoder, etc can be customized by passing a dictionary of options to `prepareToRecordAsync()`.

We provide the following preset options for convenience, as used in the example above. See below for the definitions of these presets.

-   `Expo.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY`

-   `Expo.Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY`

 We also provide the ability to define your own custom recording options, but **we recommend you use the presets, as not all combinations of options will allow you to successfully `prepareToRecordAsync()`.** You will have to test your custom options on iOS and Android to make sure it's working. In the future, we will enumerate all possible valid combinations, but at this time, our goal is to make the basic use-case easy (with presets) and the advanced use-case possible (by exposing all the functionality available in native). As always, feel free to ping us on the forums or Slack with any questions.

 In order to define your own custom recording options, you must provide a dictionary of the following key value pairs.

-   `android` : a dictionary of key-value pairs for the Android platform. This key is required.

    -   `extension` : the desired file extension. This key is required. Example valid values are `.3gp` and `.m4a`. For more information, see the [Android docs for supported output formats](https://developer.android.com/guide/topics/media/media-formats.html).

    -   `outputFormat` : the desired file format. This key is required. See the next section for an enumeration of all valid values of `outputFormat`.

    -   `audioEncoder` : the desired audio encoder. This key is required. See the next section for an enumeration of all valid values of `audioEncoder`.

    -   `sampleRate` : the desired sample rate. This key is optional. An example valid value is `44100`.

        Note that the sampling rate depends on the format for the audio recording, as well as the capabilities of the platform. For instance, the sampling rate supported by AAC audio coding standard ranges from 8 to 96 kHz, the sampling rate supported by AMRNB is 8kHz, and the sampling rate supported by AMRWB is 16kHz. Please consult with the related audio coding standard for the supported audio sampling rate.

    -   `numberOfChannels` : the desired number of channels. This key is optional. Example valid values are `1` and `2`.

        Note that `prepareToRecordAsync()` may perform additional checks on the parameter to make sure whether the specified number of audio channels are applicable.

    -   `bitRate` : the desired bit rate. This key is optional. An example valid value is `128000`.

        Note that `prepareToRecordAsync()` may perform additional checks on the parameter to make sure whether the specified bit rate is applicable, and sometimes the passed bitRate will be clipped internally to ensure the audio recording can proceed smoothly based on the capabilities of the platform.

    -   `maxFileSize` : the desired maximum file size in bytes, after which the recording will stop (but `stopAndUnloadAsync()` must still be called after this point). This key is optional. An example valid value is `65536`.

-   `ios` : a dictionary of key-value pairs for the iOS platform

    -   `extension` : the desired file extension. This key is required. An example valid value is `.caf`.

    -   `outputFormat` : the desired file format. This key is optional. See the next section for an enumeration of all valid values of `outputFormat`.

    -   `audioQuality` : the desired audio quality. This key is required. See the next section for an enumeration of all valid values of `audioQuality`.

    -   `sampleRate` : the desired sample rate. This key is required. An example valid value is `44100`.

    -   `numberOfChannels` : the desired number of channels. This key is required. Example valid values are `1` and `2`.

    -   `bitRate` : the desired bit rate. This key is required. An example valid value is `128000`.

    -   `bitRateStrategy` : the desired bit rate strategy. This key is optional. See the next section for an enumeration of all valid values of `bitRateStrategy`.

    -   `bitDepthHint` : the desired bit depth hint. This key is optional. An example valid value is `16`.

    -   `linearPCMBitDepth` : the desired PCM bit depth. This key is optional. An example valid value is `16`.

    -   `linearPCMIsBigEndian` : a boolean describing if the PCM data should be formatted in big endian. This key is optional.

    -   `linearPCMIsFloat` : a boolean describing if the PCM data should be encoded in floating point or integral values. This key is optional.

Following is an enumeration of all of the valid values for certain `RecordingOptions` keys:

-   `android` :

    -   `outputFormat` :

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_NB`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AAC_ADIF`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AAC_ADTS`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_RTP_AVP`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG2TS`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WEBM`

    -   `audioEncoder` :

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_HE_AAC`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC_ELD`

        - `Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_VORBIS`

-   `ios` :

    -   `outputFormat` :

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AC3`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_60958AC3`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_APPLEIMA4`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4CELP`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4HVXC`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4TWINVQ`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MACE3`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MACE6`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_ULAW`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_ALAW`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_QDESIGN`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_QDESIGN2`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_QUALCOMM`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER1`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER2`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER3`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_APPLELOSSLESS`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_HE`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_LD`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD_SBR`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD_V2`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_HE_V2`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_SPATIAL`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR_WB`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AUDIBLE`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_ILBC`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_DVIINTELIMA`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MICROSOFTGSM`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AES3`

        - `Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_ENHANCEDAC3`

    -   `audioQuality` :

        - `Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN`

        - `Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW`

        - `Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM`

        - `Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH`

        - `Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX`

    -   `bitRateStrategy` :

        - `Expo.Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT`

        - `Expo.Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_LONG_TERM_AVERAGE`

        - `Expo.Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_VARIABLE_CONSTRAINED`

        - `Expo.Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_VARIABLE`

For reference, following are the definitions of the two preset examples of `RecordingOptions`, as implemented in the Audio SDK:

```javascript
export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.caf',
    audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export const RECORDING_OPTIONS_PRESET_LOW_QUALITY: RecordingOptions = {
  android: {
    extension: '.3gp',
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.caf',
    audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
```
