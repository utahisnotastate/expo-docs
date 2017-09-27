---
title: Frequently Asked Questions
---

In addition to the questions below, see the [Expo Forum](http://forums.expo.io/) or [Expo AMA on Hashnode](https://hashnode.com/ama/with-exponent-ciw1qxry118wl4353o9kxaowl) for more common questions and answers.

## How much does Expo cost?

Expo is free.

Our plan is to keep it this way indefinitely.

Expo is also open source, so you don't have to trust us to stick to that plan.

We might eventually charge money for services built on top of Expo or for some kind of premium level of support and consulting.

## How do you make money if Expo is free?

Right now, we don't make any money. We have a small team that just wants to work on this, and we keep our expenses low and are mostly self-funded. We can keep working on this project like this for a while as long as there are people who want to use it.

We think if we can make Expo good enough, we can eventually help developers make money, and we could take a cut of that. This could be through helping them collect money from people using their software, or by helping them place ads in their apps, or other things. We don't really have a clear plan for this yet; our first priority is just to make Expo work really well and be as popular as possible.

## What is the difference between Expo and React Native?

Expo is kind of like Rails for React Native. Lots of things are set up for you, so it's quicker to get started and on the right path.

With Expo, you don't need Xcode or Android Studio. You just write JavaScript using whatever text editor you are comfortable with (Atom, vim, emacs, Sublime, VS Code, whatever you like). You can run XDE (our desktop software) on Mac, Windows, and Linux.

Here are some of the things Expo gives you out of the box that work right away:

-   **Support for iOS and Android**

    You can use apps written in Expo on both iOS and Android right out of the box. You don't need to go through a separate build process for each one. Just open any Expo app in the Expo Client app from the App Store on either iOS or Android (or in a simulator or emulator on your computer).

-   **Push Notifications**

    Push notifications work right out of the box across both iOS and Android, using a single, unified API. You don't have to set up APNS and GCM/FCM or configure ZeroPush or anything like that. We think we've made this as easy as it can be right now

-   **Facebook Login**

    This can take a long time to get set up properly yourself, but you should be able to get it working in 10 minutes or less on Expo.

-   **Instant Updating**

    All Expo apps can be updated in seconds by just clicking Publish in XDE. You don't have to set anything up; it just works this way. If you aren't using Expo, you'd either use Microsoft Code Push or roll your own solution for this problem

-   **Asset Management**

    Images, videos, fonts, etc. are all distributed dynamically over the Internet with Expo. This means they work with instant updating and can be changed on the fly. The asset management system built-in to Expo takes care of uploading all the assets in your repo to a CDN so they'll load quickly for anyone.

    Without Expo, the normal thing to do is to bundle your assets into your app which means you can't change them. Or you'd have to manage putting your assets on a CDN or similar yourself.

-   **Easier Updating To New React Native Releases**

    We do new releases of Expo every few weeks. You can stay on an old version of React Native if you like, or upgrade to a new one, without worrying about rebuilding your app binary. You can worry about upgrading the JavaScript on your own time.

**But no native modules...**

The most limiting thing about Expo is that you can't add in your own native modules without `detach`ing and using ExpoKit. Continue reading the next question for a full explanation.

## How do I add custom native code to my Expo project?

TL;DR you can do it, but most people never need to.

Standard Expo projects don't support custom native code, including third-party libraries which require custom native components. In an Expo project, you only write pure JS. Expo is designed this way on purpose and we think it's better this way.

In [our SDK](../sdk/index.html), we give you a large set of commonly desired, high-quality native modules. We recommend doing as much in JS as possible, since it can immediately deploy to all your users and work across both platforms, and will always continue to benefit from Expo SDK updates. Especially in the case of UI components, there is pretty much always a better option written in JS.

However, if you need something very custom--like on-the-fly video processing or low level control over the Bluetooth radio to do a firmware update--we do have early/alpha support for [using Expo in native Xcode and Android Studio projects](../guides/expokit.html).

## Is Expo similar to React for web development?

Expo and React Native are similar to React. You'll have to learn a new set of components (`View` instead of `div`, for example) and writing mobile apps is very different from websites; you think more in terms of screens and different navigators instead of separate web pages, but much more your knowledge carries over than if you were writing a traditional Android or iOS app.

## How do I share my Expo project? Can I submit it to the app stores?

The fastest way to share your Expo project is to publish it. You can do this by clicking 'Publish' in XDE or running `exp publish` in your project. This gives your app a URL; you can share this URL with anybody who has the Expo client and they can open your app immediately. [Read more about publishing on Expo](https://blog.expo.io/publishing-on-exponent-790493660d24).

When you're ready, you can also create a standalone app (`.ipa` and `.apk`) for submission to Apple and Google's app stores. Expo will build the binary for you when you run one command; see [Building Standalone Apps](../guides/building-standalone-apps.html#building-standalone-apps). Apple charges $99/year to publish your app in the App Store and Google charges a $25 one-time fee for the Play Store.

## Can I use Expo with Relay?

You can! Update your `.babelrc` you get on a new Expo project to the following:

```javascript
{
  "presets": [
    "babel-preset-expo",
    {"plugins": ["./pathToYourBabelRelayPlugin/babelRelayPlugin"]}
  ],
  "env": {
    "development": {
      "plugins": ["transform-react-jsx-source"]
    }
  }
};
```

Substitute `./pathToYourBabelRelayPlugin` with the path to your Relay plugin.

## Why does Expo use a fork of React Native?

Each Expo SDK Version corresponds to a React Native release. For example, SDK 19 corresponds to React Native 0.46.1. Often there is no difference between the fork for a given a SDK version and its corresponding React Native version, but occasionally we will find issues or want to include some code that hasn't yet been merged into the release and we will put it in our fork. Using a fork also makes it easier for people to verify that they are using the correct version of React Native for the Expo SDK version -- you know that if your SDK Version is set to 19.0.0 then you should use `https://github.com/expo/react-native/archive/sdk-19.0.0.tar.gz`.

## How do I get my existing React Native project running with Expo?

Right now, the easiest way to do this is to use XDE or exp to make a new project, and then copy over all your JavaScript source code from your existing project, and then `yarn add`ing the library dependencies you have.

If you have similar native module dependencies to what is exposed through the Expo SDK, this process shouldn't take more than a few minutes (not including `npm install` time). Please feel free to ask us questions if you run into any issues.

If you are using native libraries that aren't supported by Expo, you will either have to rewrite some parts of your application to use similar APIs that are part of Expo, or you just might not be able to get all parts of your app to work. Many things do though! 

_N.B. We used to maintain a tool `exp convert` but it is not currently working or maintained so the above method is the best way to get an existing React Native project working on Expo_

## How do I remove an Expo project that I published?

The default [privacy setting](../guides/configuration.html) for Expo apps is `unlisted` so nobody can find your app unless you share the link with them.

If you really want your published app to be 'unpublished', right now the best course of action is to just drop us a note on Slack and we can do this for you. If nobody is awake to help you, you can also publish a blank `<View />` over your app.

## What is Exponent and how is it different from Expo?

Exponent is the original name of the Expo project. You might occasionally run across some old references to it in blog posts or code or documentation. They are the same thing; we just shortened the name.

## What version of Android and iOS are supported by Expo apps?

Expo supports Android 4.4+ and iOS 9+.

## Can I use Node.js packages with Expo?

If the package depends on [Node standard library APIs](https://nodejs.org/api/index.html), you will not be able to use it with Expo. The Node standard library is a set of functionality implemented largely in C++ that exposes functions to JavaScript that aren't part of the JavaScript language specification, such as the ability to read and write to your filesystem. React Native, and by extension Expo, do not include the Node standard library, just like Chrome and Firefox do not include it. JavaScript is a language that is used in many contexts, from mobile apps (in our case), to servers, and of course on websites. These contexts all include their own runtime environments that expose different APIs  to JavaScript, depending on what makes sense in the context.