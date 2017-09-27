---
title: SecureStore
---

Provides a way to encrypt and securely store key–value pairs locally on the device. Each Expo project has a separate storage system and has no access to the storage of other Expo projects. 

iOS: Values are stored using the [keychain services](https://developer.apple.com/documentation/security/keychain_services) as `kSecClassGenericPassword`. iOS has the additional option of being able to set the value's `kSecAttrAccessible` attribute, which controls when the value is available to be fetched.

Android: Values are stored in [`SharedPreferences`](https://developer.android.com/training/basics/data-storage/shared-preferences.html), encrypted with [Android's Keystore system](https://developer.android.com/training/articles/keystore.html).

### `Expo.SecureStore.setItemAsync(key, value, options)`

Store a key–value pair.

#### Arguments

- **key (_string_)** -- The key to associate with the stored value. Keys may contain alphanumeric characters `.`, `-`, and `_`.

- **value (_string_)** -- The value to store.

-   **options (_object_)** (optional) -- A map of options:

    -   **keychainService (_string_)** --

        - iOS: The item's service, equivalent to `kSecAttrService`
        - Android: Equivalent of the public/private key pair `Alias`

        **NOTE** If the item is set with the `keychainService` option, it will be required to later fetch the value.

    -   **keychainAccessible (_enum_)** --
        - iOS only: Specifies when the stored entry is accessible, using iOS's `kSecAttrAccessible` property. See Apple's documentation on [keychain item accessibility](https://developer.apple.com/library/content/documentation/Security/Conceptual/keychainServConcepts/02concepts/concepts.html#//apple_ref/doc/uid/TP30000897-CH204-SW18). The available options are:
            - `Expo.SecureStore.WHEN_UNLOCKED`: The data in the keychain item can be accessed only while the device is unlocked by the user.
            - `Expo.SecureStore.AFTER_FIRST_UNLOCK`: The data in the keychain item cannot be accessed after a restart until the device has been unlocked once by the user. This may be useful if you need to access the item when the phone is locked.
            - `Expo.SecureStore.ALWAYS`: The data in the keychain item can always be accessed regardless of whether the device is locked. This is the least secure option.
            - `Expo.SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY`: Similar to `WHEN_UNLOCKED`, except the entry is not migrated to a new device when restoring from a backup.
            - `Expo.SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY`: Similar to `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, except the user must have set a passcode in order to store an entry. If the user removes their passcode, the entry will be deleted.
            - `Expo.SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`: Similar to `AFTER_FIRST_UNLOCK`, except the entry is not migrated to a new device when restoring from a backup.
            - `Expo.SecureStore.ALWAYS_THIS_DEVICE_ONLY`: Similar to `ALWAYS`, except the entry is not migrated to a new device when restoring from a backup.

#### Returns

A promise that will reject if value cannot be stored on the device.

### `Expo.SecureStore.getItemAsync(key, options)`

Fetch the stored value associated with the provided key.

#### Arguments

-   **key (_string_)** -- The key that was used to store the associated value.

-   **options (_object_)** (optional) -- A map of options:
  
    -   **keychainService (_string_)** -- 
      iOS: The item's service, equivalent to `kSecAttrService`.
      Android: Equivalent of the public/private key pair `Alias`.  
      **NOTE** If the item is set with the `keychainService` option, it will be required to later fetch the value.

#### Returns

A promise that resolves to the previously stored value, or null if there is no entry for the given key. The promise will reject if an error occurred while retrieving the value.

### `Expo.SecureStore.deleteItemAsync(key, options)`

Delete the value associated with the provided key.

#### Arguments

-   **key (_string_)** -- The key that was used to store the associated value.

-   **options (_object_)** (optional) -- A map of options:
  
    -   **keychainService (_string_)** -- iOS: The item's service, equivalent to `kSecAttrService`.  Android: Equivalent of the public/private key pair `Alias`.  If the item is set with a keychainService, it will be required to later fetch the value.

#### Returns

A promise that will reject if the value couldn't be deleted.
