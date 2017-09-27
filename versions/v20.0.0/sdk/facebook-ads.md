---
title: Facebook Ads
---

**Facebook Audience SDK** integration for Expo apps.

## Creating the placement ID

You need to create a placement ID to display ads. Follow steps 1 and 3 from the [Getting Started Guide for Facebook Audience](https://developers.facebook.com/docs/audience-network/getting-started) to create the placement ID.

## Development vs Production

When using Facebook Ads in development, you'll need to register your device to be able to show ads. You can add the following at the top of your file to register your device:

```js
AdSettings.addTestDevice(AdSettings.currentDeviceHash);
```

You should see fake ads after you add this snippet.

To use Facebook Ads in production with real ads, you need to publish your app on Play Store or App Store and add your app in the Facebook console. Refer the [Submit Your App for Review section in the Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started#onboarding) for more details.

## Usage

### Interstitial Ads

Interstitial Ad is a type of an ad that displays full screen modal dialog with media content. It has a dismiss button as well as the clickable area that takes user outside of your app.

Example:

```js
import { FacebookAds } from 'expo';

FacebookAds.InterstitialAdManager.showAd(placementId)
  .then(didClick => {})
  .catch(error => {})
```

The method returns a promise that will be rejected when an error occurs during a call (e.g. no fill from ad server or network error) and resolve when user either dimisses or interacts with the displayed ad.

### Native Ads

Native Ads can be customized to match the design of the app. To display a native ad, you need to,

#### 1. Create NativeAdsManager instance

The `NativeAdManager` that is responsible for caching and fetching ads as you request them.

```js
import { FacebookAds } from 'expo';

const adsManager = new FacebookAds.NativeAdsManager(placementId, numberOfAdsToRequest);
```

The constructor accepts two parameters:

- `placementId` - which is an unique identifier describing your ad units
- `numberOfAdsToRequest` - which is a number of ads to request by ads manager at a time

#### 2. Wrap your component with `withNativeAd` HOC

Now you need to wrap the component you want to use to show your add with the `withNativeAd` HOC.
The component will receive the `nativeAd` prop you can use to render an ad.

```js
import { FacebookAds } from 'expo';

class AdComponent extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.nativeAd.description}</Text>
      </View>
    );
  }
}

export default FacebookAds.withNativeAd(AdComponent);
```

The `nativeAd` object can contain the following properties:

- `icon`: URL for the icon image
- `coverImage` - URL for the cover image
- `title` - Title of the Ad
- `subtitle` - Subtitle of the Ad
- `description` - A long description of the Ad
- `callToActionText` - Call to action phrase, e.g. - "Install Now"
- `socialContext` - social context for the Ad, for example "Over half a million users"

#### 3. Render the ad component

Now you can render the wrapped component and pass the `adsManager` instance you created earlier.

```js
class MyApp extends React.Component {
  render() {
    return (
      <View>
        <AdComponent adsManager={adsManager} />
      </View>
    );
  }
}
```

### BannerView

BannerView component allows you to display native as banners (know as *AdView*).

Banners are available in 3 sizes:

- `standard` (BANNER_HEIGHT_50)
- `large` (BANNER_HEIGHT_90)
- `rectangle` (RECTANGLE_HEIGHT_250)

#### 1. Showing ad

In order to show an ad, you have to first import it `BannerView` from the package:

```js
import { FacebookAds } from 'expo';

function ViewWithBanner(props) {
  return (
    <View>
      <FacebookAds.BannerView
        placementId="YOUR_BANNER_PLACEMENT_ID"
        type="standard"
        onPress={() => console.log('click')}
        onError={(err) => console.log('error', err)}
      />
    </View>
  );
}
```

## API

### NativeAdsManager

A wrapper for [`FBNativeAdsManager`](https://developers.facebook.com/docs/reference/ios/current/class/FBNativeAdsManager/). It provides a mechanism to fetch a set of ads and use them.

#### disableAutoRefresh

By default the native ads manager will refresh its ads periodically. This does not mean that any ads which are shown in the application's UI will be refreshed, but requesting next native ads to render may return new ads at different times.

```js
adsManager.disableAutoRefresh();
```

#### setMediaCachePolicy (iOS)

This controls which media from the native ads are cached before being displayed. The default is to not block on caching.

```js
adsManager.setMediaCachePolicy('none' | 'icon' | 'image' | 'all');
```

**Note:** This method is a noop on Android

### InterstitialAdManager

InterstitialAdManager is a manager that allows you to display interstitial ads within your app.

#### showAd

Shows a fullscreen interstitial ad asynchronously.

```js
InterstitialAdManager.showAd('placementId')
  .then(...)
  .catch(...);
```

Promise will be rejected when there's an error loading ads from Facebook Audience network. It will resolve with a
`boolean` indicating whether user didClick an ad or not.

**Note:** There can be only one `showAd` call being performed at a time. Otherwise, an error will be thrown.

### AdSettings

AdSettings contains global settings for all ad controls.

#### currentDeviceHash

Constant which contains current device's hash.

#### addTestDevice

Registers given device to receive test ads. When you run app on simulator, it should automatically get added. Use it
to receive test ads in development mode on a standalone phone.

All devices should be specified before any other action takes place, like [`AdsManager`](#nativeadsmanager) gets created.

```js
AdSettings.addTestDevice('hash');
```

#### clearTestDevices

Clears all previously set test devices. If you want your ads to respect newly set config, you'll have to destroy and create
an instance of AdsManager once again.

```js
AdSettings.clearTestDevices();
```

#### setLogLevel (iOS)

Sets current SDK log level.

```js
AdSettings.setLogLevel('none' | 'debug' | 'verbose' | 'warning' | 'error' | 'notification');
```

**Note:** This method is a noop on Android.

#### setIsChildDirected

Configures the ad control for treatment as child-directed.

```js
AdSettings.setIsChildDirected(true | false);
```

#### setMediationService

If an ad provided service is mediating Audience Network in their sdk, it is required to set the name of the mediation service

```js
AdSettings.setMediationService('foobar');
```

#### setUrlPrefix

Sets the url prefix to use when making ad requests.

```js
AdSettings.setUrlPrefix('...');
```

**Note:** This method should never be used in production
