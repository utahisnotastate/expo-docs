---
title: Google
---

Provides Google authentication integration for Expo apps, using either the native Google Sign In SDK (only in standalone apps) or a system web browser (not WebView, so credentials saved on the device can be re-used!).

You'll get an access token after a succesful login. Once you have the token, if you would like to make further calls to the Google API, you can use Google's [REST APIs](https://developers.google.com/apis-explorer/) directly through HTTP (using [fetch](https://facebook.github.io/react-native/docs/network.html#fetch), for example).

```javascript
// Example of using the Google REST API
async function getUserInfo(accessToken) {
  let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}`},
  });

  return userInfoResponse;
}
```

## Usage

### `Expo.Google.logInAsync(options)`

Prompts the user to log into Google and grants your app permission to access some of their Google data, as specified by the scopes.

#### :param object options

 A map of options:

-   **behavior** (_string_) -- The type of behavior to use for login, either `web` or `system`. Native (`system`) can only be used inside of a standalone app when built using the steps described below. Default is `web` inside of Expo app, and `system` in standalone. The only case where you would need to change this is if you would prefer to use `web` inside of a standalone app.
-   **scopes** (_array_) -- An array specifying the scopes to ask for from Google for this login ([more information here](https://gsuite-developers.googleblog.com/2012/01/tips-on-using-apis-discovery-service.html)). Default scopes are `['profile', 'email']`.
-   **androidClientId** (_string_) -- The Android client id registered with Google for use in the Expo client app.
-   **iosClientId** (_string_) -- The iOS client id registered with Google for use in the Expo client app.
-   **androidStandaloneAppClientId** (_string_) -- The Android client id registered with Google for use in a standalone app.
-   **iosStandaloneAppClientId** (_string_) -- The iOS client id registered with Google for use in a standalone app.

#### Returns

If the user or Google cancelled the login, returns `{ type: 'cancel' }`.

Otherwise, returns `{ type: 'success', accessToken, idToken, refreshToken, {...profileInformation} }`, `accessToken` is a string giving the access token to use with Google HTTP API requests.

## Using it inside of the Expo app

In the Expo client app, you can only use browser-based login (this works very well actually because it re-uses credentials saved in your system browser). If you build a standalone app, you can use the native login for the platform.

To use Google Sign In, you will need to create a project on the Google Developer Console and create an OAuth 2.0 client ID. This is, unfortunately, super annoying to do and we wish there was a way we could automate this for you, but at the moment the Google Developer Console does not expose an API. _You also need to register a separate set of Client IDs for a standalone app, the process for this is described later in this document_.

-   **Get an app set up on the Google Developer Console**

    -   Go to the [Credentials Page](https://console.developers.google.com/apis/credentials)
    -   Create an app for your project if you haven't already.
    -   Once that's done, click "Create Credentials" and then "OAuth client ID." You will be prompted to set the product name on the consent screen, go ahead and do that.

-   **Create an iOS OAuth Client ID**

    -   Select "iOS Application" as the Application Type. Give it a name if you want (e.g. "iOS Development").
    -   Use `host.exp.exponent` as the bundle identifier.
    -   Click "Create"
    -   You will now see a modal with the client ID.
    -   The client ID is used in the `iosClientId` option for `Expo.Google.loginAsync` (see code example below).

-   **Create an Android OAuth Client ID**

    -   Select "Android Application" as the Application Type. Give it a name if you want (maybe "Android Development").
    -   Run `openssl rand -base64 32 | openssl sha1 -c` in your terminal, it will output a string that looks like `A1:B2:C3` but longer. Copy the output to your clipboard.
    -   Paste the output from the previous step into the "Signing-certificate fingerprint" text field.
    -   Use `host.exp.exponent` as the "Package name".
    -   Click "Create"
    -   You will now see a modal with the Client ID.
    -   The client ID is used in the `androidClientId` option for `Expo.Google.loginAsync` (see code example below).

-   **Add the Client IDs to your app**

    ```javascript
    import Expo from 'expo';

    async function signInWithGoogleAsync() {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: YOUR_CLIENT_ID_HERE,
          iosClientId: YOUR_CLIENT_ID_HERE,
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
    }
    ```

## Deploying to a standalone app on Android

If you want to use Google Sign In for a standalone app, you can follow these steps. These steps assume that you already have it working on the Expo client app. If you have already created an API key for Google Maps, you skip steps 3 through 8, inclusive.

-   **Get a Google API Key for your app** (_skip this if you already have one, eg: for Google Maps_)
    1.  Build a standalone app and download the apk, or find one that you have already built.
    2.  Go to the [Google Developer Credentials](https://console.developers.google.com/apis/credentials)
    3.  Click **Create credentials**, then **API Key**, and finally click **RESTRICT KEY** in the modal that pops up.
    4.  Click the **Android apps** radio button under **Key restriction**, then click **+ Add package name and fingerprint**.
    5.  Add your `android.package` from `app.json` (eg: `ca.brentvatne.growlerprowler`) to the **Package name** field.
    6.  Run `keytool -list -printcert -jarfile growler.apk | grep SHA1 | awk '{ print $2 }'` (where `growler.apk` is the name of the apk produced in step 1).
    7.  Take the output from the previous step and insert it in the **SHA-1 certificate fingerprint** field.
    8.  Press **Save**.
-   **Get an OAuth client ID for your app**
    1.  Build a standalone app and download the apk, or find one that you have already built.
    2.  Go to the [Google Developer Credentials](https://console.developers.google.com/apis/credentials).
    3.  Click **Create credentials**, then **OAuth client ID**, then select the **Android** radio button.
    4.  Run `keytool -list -printcert -jarfile growler.apk | grep SHA1 | awk '{ print $2 }'` (where `growler.apk` is the name of the apk produced in step 1).
    5.  Take the output from the previous step and insert it in the **Signing-certificate fingerprint** field.
    6.  Add your `android.package` from `app.json` (eg: `ca.brentvatne.growlerprowler`) to the **Package name** field.
    7.  Press **Create**.
-   **Add the configuration to your app**
    1.  Build a standalone app and download the apk, or find one that you have already built.
    2.  Go to the [Google Developer Credentials](https://console.developers.google.com/apis/credentials) and find your API key.
    3.  Open `app.json` and add your **Google API Key** to `android.config.googleSignIn.apiKey`.
    4.  Run `keytool -list -printcert -jarfile growler.apk | grep SHA1 | awk '{ print $2 }' | sed -e 's/\://g'` (where `growler.apk` is the name of the apk produced in step 1).
    5.  Add the result from the previous step to `app.json` under `android.config.googleSignIn.certificateHash`.
    6.  When you use `Expo.Google.logInAsync(..)`, pass in the **OAuth client ID** as the `androidStandaloneAppClientId` option.
    7.  Rebuild your standalone app.

## Deploying to a standalone app on iOS

If you want to use native sign in for a standalone app, you can follow these steps. These steps assume that you already have it working on the Expo client app.

1.  Add a `bundleIdentifier` to your `app.json` if you don't already have one.
2.  Open your browser to [Google Developer Credentials](https://console.developers.google.com/apis/credentials)
3.  Click **Create credentials** and then **OAuth client ID**, then choose **iOS**.
4.  Provide your `bundleIdentifier` in the **Bundle ID** field, then press **Create**.
5.  Add the given **iOS URL scheme** to your `app.json` under `ios.config.googleSignIn.reservedClientId`.
6.  Wherever you use `Expo.Google.logInAsync`, provide the **OAuth client ID** as the `iosStandaloneAppClientId` option.
7.  Rebuild your standalone app.
