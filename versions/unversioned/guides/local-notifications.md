# Local Notification Tutorial

If your app doesn't need push notifications, expo allows you to also send local notifications. These are much simpler to setup, and we can reuse some of the code from push notifications to speed up the process. 

To create notifications, we will do these steps in the following order

 1. Create the notification and scheduling objects.
 2. Setup permissions for iOS notification
 3. Setup a listener so iOS users can get the notification. 

### Notes:
* Notifications must be tested on a device and can not be tested on a simulator
* iOS users can not test notifications until we complete step 3. 

#### Example App
In this example, our app has a button which will send a local notification after 5 seconds have passed. 

##### Create the notification and scheduling objects

We need to setup a handler for when the user presses the button. The handler, in this example, will consist of: creating a notification object, creating a schedule object(when to send the notification), and lastly calling the [Expo.Notifications.scheduleLocalNotificationAsync()](https://docs.expo.io/versions/latest/sdk/notifications.html#exponotificationsschedulelocalnotificationasynclocalnotification-schedulingoptions) method using the notification and scheduling object we create as inputs. 

We first create a notification object with minimal info using the notification object provided by expo [Link](https://docs.expo.io/versions/latest/sdk/notifications.html#related-types-1)

For this example, we will use the following object.
```javascript
const localnotification = {
      title: 'Example Title!',
      body: 'This is the body text of the local notification',
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      }
    }
```
Next, we need to tell the phone when to send that notification. In our case, we want it to send the notification 5 seconds after the button is pressed. We create a variable with the current time, add 5 seconds to it, and then store that value in the schedulingOptions object as the value for the time property. 

Here is how that looks like
```javascript
let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5000;
    
    const schedulingOptions = {time: sendAfterFiveSeconds };
```
Lastly, we call the Expo.Notifications.scheduleLocalNotificationAsync() and supply our notification and scheduling object. 
Our entire handlebuttonPress() looks like this: 

```javascript
  _handleButtonPress = () => {
    const localnotification = {
      title: 'Example Title!',
      body: 'This is the body text of the local notification',
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      }
    }
    let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5000;
    
    const schedulingOptions = {time: sendAfterFiveSeconds };
    Notifications.scheduleLocalNotificationAsync(localnotification, schedulingOptions);
  };

```

If you are on android. You can now test this out. [This is a link to the snack](https://snack.expo.io/rkV63J8FZ). Simply scan the QR code using the expo app, and you'll see it in action. 

iOS users can't use this yet. Our next step is to allow users on iOS to get notifications. 

##### Setup permissions for iOS users

Enabling iOS users to get notifications is pretty simple to setup. We can reuse the same code used for push notifications. The steps to enable notifications on iOS are:
1. Get permission from user to send notifications.
2. Setup a listener for the notification so when it's time to show up, it can be properly displayed on iOS.  

That's it. Let's start. 

To get permission from the user, we can use the same code as push notifications but remove all the parts dealing with push notification specifics and anything else unncessary for us.. To see the full code for push notifications [view this link](https://docs.expo.io/versions/latest/guides/push-notifications.html#1-save-the-users-expo-push-token-on-your-server).

You can name the function whatever you want, but here is the code you need. All this code does is check if the user has granted us to send notifications. If they haven't the user will be prompted with an alert asking them to enable permissions. 
```javascript
async function getiOSNotificationPermission() {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
    
        if(existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            finalStatus = status;
    }
    
  }
```
That's it. 

##### Setup a listener for iOS users
Now we just need to setup a listener to display the notification for iOS users. Expo provides us with methods to do so. We can use the [Expo.Notifications.addListener()](https://docs.expo.io/versions/latest/sdk/notifications.html#exponotificationsaddlistenerlistener) method with the notification we declared earlier as the input. Here is how it looks:
Listen for notifications
```javascript
listenForNotifications = () => {
    // We add a listener for a scheduled notification
    Notifications.addListener((notification) => {
      // When the time has come for the notification to display, and the phone uses iOS, we display the notification on screen for the user.
      if(notification.origin === 'received' && Platform.OS === 'ios') {
      Alert.alert(notification.title, notification.body)
      }
      
    });
    
  };

```

Now that we have the functions setup for local notifications we need to call them somewhere. This will vary per use, but for this example we are putting it when componentWillMount() is called. 

Here is a link to the snack([link](https://snack.expo.io/HkJpmlUtZ)) with iOS permissions enabled. When testing out this example, make sure that you exit out of the app before time is up. The notification won't display on iOS if the app is being viewed. 
