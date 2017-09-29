---
title: Camera
---

A React component that renders a preview for the device's either front or back camera. Camera's parameters like zoom, auto focus, white balance and flash mode are adjustable. With use of `Camera` one can also take photos and record videos that are saved to the app's cache. Only one Camera preview is supported by Expo right now.

Requires `Permissions.CAMERA`. Video recording requires `Permissions.AUDIO_RECORDING`.

### Basic Example

```javascript
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
```

### Comprehensive Example

Check out a full example at [expo/camerja](https://github.com/expo/camerja). You can try it with Expo at [@community/camerja](https://expo.io/@community/camerja).

### props

- **type**

Camera facing. Use one of `Camera.Constants.Type`. When `Type.front`, use the front-facing camera. When `Type.back`, use the back-facing camera. Default: `Type.back`.

- **flashMode**

Camera flash mode. Use one of `Camera.Constants.FlashMode`. When `on`, the flash on your device will turn on when taking a picture, when `off`, it wont't. Setting to `Type.auto` will fire flash if required, `Type.torch` turns on flash during the preview. Default: `off`.

- **autoFocus**

State of camera auto focus. Use one of `Camera.Constants.AutoFocus`. When `on`, auto focus will be enabled, when `off`, it wont't and focus will lock as it was in the moment of change but it can be adjusted on some devices via `focusDepth` prop.

- **zoom** (_float_)

A value between 0 and 1 being a percentage of device's max zoom. 0 - not zoomed, 1 - maximum zoom. Default: 0.

- **whiteBalance**

Camera white balance. Use one of `Camera.Constants.WhiteBalance`: `auto`, `sunny`, `cloudy`, `shadow`, `fluorescent`, `incandescent`. If a device does not support any of these values previous one is used.

- **focusDepth** (_float_)

Distance to plane of sharpest focus. A value between 0 and 1: 0 - infinity focus, 1 - focus as close as possible. Default: 0.

- **ratio** (_string_)

Android only. A string representing aspect ratio of the preview, eg. `4:3`, `16:9`, `1:1`. To check if a ratio is supported by the device use `getSupportedRatiosAsync`. Default: `4:3`.

- **onCameraReady** (_function_)

Callback invoked when camera preview has been set.

## Methods

To use methods that Camera exposes one has to create a components `ref` and invoke them using it.

```javascript
// ...
<Camera ref={ref => { this.camera = ref; }} />
// ...
snap = async () => {
  if (this.camera) {
    let photo = await this.camera.takePictureAsync();
  }
};
```

### `takePictureAsync`

Takes a picture and saves it to app's cache directory. Photos are rotated to match device's orientation and scaled to match the preview. Anyway on Android it is essential to set `ratio` prop to get a picture with correct dimensions.

#### Arguments

-   **options (_object_)** --

      A map of options:

    -   **quality (_number_)** -- Specify the quality of compression, from 0 to 1. 0 means compress for small size, 1 means compress for maximum quality.
    -   **base64 (_boolean_)** -- Whether to also include the image data in Base64 format.
    -   **exif (_boolean_)** -- Whether to also include the EXIF data for the image.

#### Returns

Returns a Promise that resolves to an object: `{ uri, width, height, exif, base64 }` where `uri` is a URI to the local image file (useable as the source for an `Image` element) and `width, height` specify the dimensions of the image. `base64` is included if the `base64` option was truthy, and is a string containing the JPEG data of the image in Base64--prepend that with `'data:image/jpg;base64,'` to get a data URI, which you can use as the source for an `Image` element for example. `exif` is included if the `exif` option was truthy, and is an object containing EXIF data for the image--the names of its properties are EXIF tags and their values are the values for those tags.

The local image URI is temporary. Use `Expo.FileSystem.copyAsync` to make a permanent copy of the image.

### `recordAsync`

Starts recording a video that will be saved to cache directory. Videos are rotated to match device's orientation. Flipping camera during a recording results in stopping it.

#### Arguments

-   **options (_object_)** --

      A map of options:

    -   **quality (_VideoQuality_)** -- Specify the quality of recorded video. Usage: `Camera.Constants.VideoQuality['<value>']`, possible values: for 16:9 resolution `2160p`, `1080p`, `720p`, `480p` (_Android only_) and for 4:3 `4:3` (the size is 640x480). If the chosen quality is not available for a device, the highest available is chosen.
    -   **maxDuration (_number_)** -- Maximum video duration in seconds.
    -   **maxFileSize (_number_)** -- Maximum video file size in bytes.
    -   **mute (_boolean_)** -- If present, video will be recorded with no sound.

#### Returns

Returns a Promise that resolves to an object containing video file `uri` property. The Promise is returned if `stopRecording` was invoked, one of `maxDuration` and `maxFileSize` is reached or camera preview is stopped.

### `stopRecording`

Stops recording if any is in progress.

### `getSupportedRatiosAsync`

Android only. Get aspect ratios that are supported by the device and can be passed via `ratio` prop.

#### Returns

Returns a Promise that resolves to an array of strings representing ratios, eg. `['4:3', '1:1']`.
