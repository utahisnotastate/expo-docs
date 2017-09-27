---
title: Advanced ExpoKit Topics
---

This guide goes deeper into a few [ExpoKit](expokit.html) topics that aren't critical
right out of the box, but that you may encounter down the road. If you're not familiar with
ExpoKit, you might want to read [the ExpoKit guide](expokit.html) first.

## Verifying Bundles (iOS only)

When we serve your JS over-the-air to your ExpoKit project, we include a signature so that
your project can verify that the JS actually came from our servers.

By default, projects that use ExpoKit have this feature disabled on iOS and enabled on
Android. We encourage you to enable it on iOS so that your code is verified for all of your
users.

To enable code verification in your native project with ExpoKit:

-   Fulfill one of these two requirements (you only need one):

    -   Use a non-wildcard bundle identifier when provisioning the app (recommended)
    -   Enable **Keychain Sharing** in your Xcode project settings under **Capabilities**. (faster to
        set up)

-   In `ios/your-project/Supporting/EXShell.plist`, set `isManifestVerificationBypassed` to
    `NO` (or delete this key entirely).

## Disabling Expo Analytics

By default, apps using ExpoKit will track some Expo-specific usage statistics. This is covered
in our [privacy policy](https://expo.io/privacy). You can disable Expo analytics in your app by
following these steps:

On iOS, add the key `EXAnalyticsDisabled` to your app's main `Info.plist` with the value `YES`.

## Configuring the JS URL

In development, your ExpoKit project will request your local build from XDE/exp. You can see this configuration in `EXBuildConstants.plist` (iOS) or `ExponentBuildConstants` (Android). You shouldn't need to edit it, because it's written automatically when you serve the project.

In production, your ExpoKit project will request your published JS bundle. This is configured in `EXShell.plist` (iOS) and `MainActivity.java` (Android). If you want to specify custom behavior in iOS, you can also set the `[ExpoKit sharedInstance].publishedManifestUrlOverride` property.

## Using DocumentPicker

In iOS Expokit projects, the DocumentPicker module requires the iCloud entitlement to work properly. If your app doesn't have it already, you can add it by opening the project in Xcode and following these steps:

- In the project go to the `Capabilities` tab.
- Set the iCloud switch to on.
- Check the `iCloud Documents` checkbox.

If everything worked properly your screen should look like this:

![](./icloud-entitlement.png)
