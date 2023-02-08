# react-native-osmdroid [![npm version](https://img.shields.io/npm/v/@splicer97/react-native-osmdroid.svg?style=flat)](https://www.npmjs.com/package/@splicer97/react-native-osmdroid) [![Downloads](https://img.shields.io/npm/dm/@splicer97/react-native-osmdroid.svg)](http://www.npmtrends.com/@splicer97/react-native-osmdroid)

React Native Open Street Maps components for Android.
This is unofficial React Native wrapper for Osmdroid SDK.
Many thanks to [fqborges](https://github.com/fqborges) for his [library](https://github.com/fqborges/react-native-maps-osmdroid), which is the basis of this library!
## Installation

```sh
npm install @splicer97/react-native-osmdroid
```

or

```sh
yarn add @splicer97/react-native-osmdroid
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

## Component API

[`<MapView />` Component API](docs/mapview.md)

[`<Marker />` Component API](docs/marker.md)

[`<Callout />` Component API](docs/callout.md)

[`<Polygon />` Component API](docs/polygon.md)

[`<Polyline />` Component API](docs/polyline.md)

[`<Circle />` Component API](docs/circle.md)

[`<Overlay />` Component API](docs/overlay.md)

[`<Heatmap />` Component API](docs/heatmap.md)

[`<Geojson />` Component API](docs/geojson.md)

[`<URLTile />` and `<WMSTile />` Component API](docs/tiles.md)

## Usage

```js
import MapView from '@splicer97/react-native-osmdroid';

// ...
<MapView
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
