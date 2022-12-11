# react-native-osmdroid

This is unofficial React Native wrapper for osmdroid maps

## Installation

```sh
npm install react-native-osmdroid
```

or

```sh
yarn add react-native-osmdroid
```

## Manifest

In most cases, you will have to set the following authorizations in your AndroidManifest.xml:

```sh
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"  />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

If you are only using parts of the library, you can adjust the permissions accordingly.

Online tile provider

```sh
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"  />
```

Offline tile provider and storing tiles

```sh
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Location provider

```sh
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

Android 6.0+ devices require you have to check for "dangerous" permissions at runtime.
osmdroid requires the following dangerous permissions:
WRITE_EXTERNAL_STORAGE and ACCESS_COARSE_LOCATION/ACCESS_FINE_LOCATION.
See [OpenStreetMapViewer's implementation](https://github.com/osmdroid/osmdroid/blob/master/OpenStreetMapViewer/src/main/java/org/osmdroid/MainActivity.java#L83) or [Google Documentation on Permissions](https://developer.android.com/training/permissions/requesting)

## Usage

```js
import { OsmdroidView } from 'react-native-osmdroid';

// ...

<OsmdroidView color="tomato" />;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
