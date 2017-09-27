---
title: AppLoading
---

A React component that tells Expo to keep the app loading screen open if it is the first and only component rendered in your app. When it is removed, the loading screen will disappear and your app will be visible.

This is incredibly useful to let you download and cache fonts, logo and icon images and other assets that you want to be sure the user has on their device for an optimal experience before rendering they start using the app.

## Example

```javascript
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Asset, AppLoading } from 'expo';

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      /* @info As long as AppLoading is the only leaf/native component that has been mounted, the loading screen will remain visible */
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );/* @end */

    }

    return (
      <View style={{ flex: 1 }}>
        <Image source={require('./assets/images/expo-icon.png')} />
        <Image source={require('./assets/images/slack-icon.png')} />
      </View>
    );
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/expo-icon.png'),
      require('./assets/images/slack-icon.png'),
    ];

    /* @info Read more about <a href='../guides/preloading-and-caching-assets.html'>Preloading and Caching Assets</a> */
    for (let image of images) {
      await Asset.fromModule(image).downloadAsync();
    }/* @end */

  }
}
```

### props

The following props are recommended, but optional for the sake of backwards compatibility (they were introduced in SDK21). If you do not provide any props, you are responsible for coordinating loading assets, handling errors, and updating state to unmount the `AppLoading` component.

- **startAsync (_function_)** -- A `function` that returns a `Promise`, and the `Promise` should resolve when the app is done loading required data and assets.
- **onError (_function_)** -- If `startAsync` throws an error, it is caught and passed into the function provided to `onError`.
- **onFinish (_function_)** -- **(Required if you provide `startAsync`)**. Called when `startAsync` resolves or rejects. This should be used to set state and unmount the `AppLoading` component.