---
title: Magnetometer
---

Access the device magnetometer sensor(s) to respond to measure the changes
in the magnetic field. You can access the calibrated values with `Expo.Magnetometer.`
and uncalibrated raw values with `Expo.MagnetometerUncalibrated`.

### `Expo.Magnetometer.addListener(listener)`

Subscribe for updates to the Magnetometer.

#### Arguments

-   **listener (_function_)** -- A callback that is invoked when an
    Magnetometer update is available. When invoked, the listener is
    provided a single argumument that is an object    containing keys x, y,
    z.

#### Returns

-   An EventSubscription object that you can call remove() on when you
    would like to unsubscribe the listener.

### `Expo.Magnetometer.removeAllListeners()`

Remove all listeners.

### `Expo.Magnetometer.setUpdateInterval(intervalMs)`

Subscribe for updates to the Magnetometer.

#### Arguments

-   **intervalMs (_number_)** Desired interval in milliseconds between
    Magnetometer updates.

## Example: basic subscription

```javascript
import React from 'react';
import {
  Magnetometer,
} from 'expo';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class MagnetometerSensor extends React.Component {
  state = {
    MagnetometerData: {},
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Magnetometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Magnetometer.addListener((result) => {
      this.setState({MagnetometerData: result});
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { x, y, z } = this.state.MagnetometerData;

    return (
      <View style={styles.sensor}>
        <Text>Magnetometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
```
