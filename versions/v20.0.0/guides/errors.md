---
title: Error Handling
---

This guide details a few strategies available for reporting and recovering from errors in your project.

## Handling Fatal JS Errors

If your app encounters a fatal JS error, Expo will report the error differently depending on whether your app is in development or production.

**In Development:** If you're serving your app from XDE or `exp`, the fatal JS error will be reported to the [React Native RedBox](https://facebook.github.io/react-native/docs/debugging.html#in-app-errors-and-warnings) and no other action will be taken.

**In Production:** If your published app encounters a fatal JS error, Expo will immediately reload your app. If the error happens very quickly after reloading, Expo will show a generic error screen with a button to try manually reloading.

Expo can also report custom information back to you after your app reloads. If you use `ErrorRecovery.setRecoveryProps`, and the app later encounters a fatal JS error, the contents of that method call will be passed back into your app's initial props upon reloading. See [Expo.ErrorRecovery](../sdk/error-recovery.html).

## Tracking JS Errors

We recommend using [Sentry](https://sentry.io/for/javascript/) to track JS errors in production.

## What about Native Errors?

Since Expo's native code never changes with regard to your project, the native symbols aren't especially meaningful (they would show you a trace into the React Native core or into Expo's native SDK). In the vast majority of circumstances *, the JS error is what you care about.

Nonetheless, if you really want native crash logs and are deploying your app as a [standalone app](building-standalone-apps.html), you can configure custom Fabric keys for Android. See [Configuration with app.json](configuration.html).

For iOS, right now we don't expose a way for you to see native crash logs from your Expo app. This is because we don't build iOS native code on demand, which would be a requirement for uploading your debug symbols to Fabric (or a similar service).

`*` There are a few circumstances where it's possible to crash native code by writing bad JS. Usually these are in areas where it would be performance-prohibitive to add native validation to your code, e.g. the part of the React Native bridge that converts JS objects into typed native values. If you encounter an explicable native crash, double check that your parameters are of the right type.