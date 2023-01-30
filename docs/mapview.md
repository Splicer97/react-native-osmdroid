# `<MapView />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `region` | `Region` |  | The region to be displayed by the map. <br/><br/>The region is defined by the center coordinates and the span of coordinates to display.
| `initialRegion` | `Region` |  | The initial region to be displayed by the map.  Use this prop instead of `region` only if you don't want to control the viewport of the map besides the initial region.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.
| `camera` | `Camera` |  | The camera view the map should display. If you use this, the `region` property is ignored.
| `initialCamera` | `Camera` |  | Like `initialRegion`, use this prop instead of `camera` only if you don't want to control the viewport of the map besides the initial camera setting.<br/><br/> Changing this prop after the component has mounted will not result in a region change.<br/><br/> This is similar to the `initialValue` prop of a text input.
| `zoomEnabled` | `Boolean` | `true` | If `false` the user won't be able to pinch/zoom the map.
| `minZoomLevel` | `Number` | `0` | Minimum zoom value for the map, must be between 0 and 20
| `maxZoomLevel` | `Number` | `20` | Maximum zoom value for the map, must be between 0 and 20
| `rotateEnabled` | `Boolean` | `true` | If `false` the user won't be able to pinch/rotate the map.
| `scrollEnabled` | `Boolean` | `true` | If `false` the user won't be able to change the map region being displayed.
| `moveOnMarkerPress` | `Boolean` | `true` | `Android only` If `false` the map won't move when a marker is pressed.


## Events

To access event data, you will need to use `e.nativeEvent`. For example, `onPress={e => console.log(e.nativeEvent)}` will log the entire event object to your console.

| Event Name | Returns | Notes
|---|---|---|
| `onMapReady` |  | Callback that is called once the map is fully loaded.
| `onRegionChange` | (`Region`) | Callback that is called continuously when the region changes, such as when a user is dragging the map.
| `onRegionChangeComplete` | (`Region`) | Callback that is called once when the region changes, such as when the user is done moving the map.
| `onPress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user taps on the map.
| `onPanDrag` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user presses and drags the map. **NOTE**: for iOS `scrollEnabled` should be set to false to trigger the event
| `onLongPress` | `{ coordinate: LatLng, position: Point }` | Callback that is called when user makes a "long press" somewhere on the map.
| `onMarkerPress` |  | Callback that is called when a marker on the map is tapped by the user.
| `onMarkerSelect` |  | Callback that is called when a marker on the map becomes selected. This will be called when the callout for that marker is about to be shown.
| `onMarkerDeselect` |  | Callback that is called when a marker on the map becomes deselected. This will be called when the callout for that marker is about to be hidden.
| `onCalloutPress` |  | Callback that is called when a callout is tapped by the user.
| `onMarkerDragStart` | `{ coordinate: LatLng, position: Point }` | Callback that is called when the user initiates a drag on a marker (if it is draggable)
| `onMarkerDrag` | `{ coordinate: LatLng, position: Point }` | Callback called continuously as a marker is dragged
| `onMarkerDragEnd` | `{ coordinate: LatLng, position: Point }` | Callback that is called when a drag on a marker finishes. This is usually the point you will want to setState on the marker's coordinate again




## Methods

| Method Name | Arguments | Notes
|---|---|---|
| `getCamera` | | Returns a `Promise<Camera>` structure indicating the current camera configuration.
| `animateCamera` | `camera: Camera`, `{ duration: Number }` | Animate the camera to a new view. You can pass a partial camera object here; any property not given will remain unmodified.
| `setCamera` | `camera: Camera`, `{ duration: Number }` | Like `animateCamera`, but sets the new view instantly, without an animation.
| `animateToRegion` | `region: Region`, `duration: Number` |
| `getMapBoundaries` | | `Promise<{northEast: LatLng, southWest: LatLng}>`
| `setMapBoundaries` | `northEast: LatLng`, `southWest: LatLng` | The boundary is defined by the map's center coordinates, not the device's viewport itself.
| `setIndoorActiveLevelIndex` | `levelIndex: Number` |
| `fitToElements` | `options: { edgePadding: EdgePadding, animated: Boolean }`
| `fitToSuppliedMarkers` | `markerIDs: String[], options: { edgePadding: EdgePadding, animated: Boolean }` | If you need to use this in `ComponentDidMount`, make sure you put it in a timeout or it will cause performance problems. **Note** edgePadding is Google Maps only
| `fitToCoordinates` | `coordinates: Array<LatLng>, options: { edgePadding: EdgePadding, animated: Boolean }` | If called in `ComponentDidMount` in android, it will cause an exception. It is recommended to call it from the MapView `onLayout` event.
| `addressForCoordinate` | `coordinate: LatLng` | Converts a map coordinate to a address (`Address`). Returns a `Promise<Address>` **Note** Not supported on Google Maps for iOS.
| `pointForCoordinate` | `coordinate: LatLng` | Converts a map coordinate to a view coordinate (`Point`). Returns a `Promise<Point>`.
| `coordinateForPoint` | `point: Point` | Converts a view coordinate (`Point`) to a map coordinate. Returns a `Promise<Coordinate>`.
| `getMarkersFrames` | `onlyVisible: Boolean` | Get markers' centers and frames in view coordinates. Returns a `Promise<{ "markerID" : { point: Point, frame: Frame } }>`. **Note**: iOS only.



## Types

```
type Region {
  latitude: Number,
  longitude: Number,
  latitudeDelta: Number,
  longitudeDelta: Number,
}
```

```
type Camera = {
    center: {
       latitude: number,
       longitude: number,
   },
   pitch: number,
   heading: number,

   // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
   altitude: number,

   // Only when using Google Maps.
   zoom: number
}
```

Latitude and longitude are self explanatory while latitudeDelta and longitudeDelta may not.
On the [developer.apple.com](https://developer.apple.com/reference/mapkit/mkcoordinatespan/1452417-latitudedelta) website this is how the "latitudeDelta" property is explained:

> The amount of north-to-south distance (measured in degrees) to display on the map. Unlike longitudinal distances, which vary based on the latitude, one degree of latitude is always approximately 111 kilometers (69 miles).

If this is not enough, you can find a [visual explanation on stackoverflow](https://stackoverflow.com/questions/36685372/how-to-zoom-in-out-in-react-native-map/36688156#36688156).


```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```

```
type Location {
  latitude: Number,
  longitude: Number,
  altitude: Number,
  timestamp: Number, //Milliseconds since Unix epoch
  accuracy: Number,
  altitudeAccuracy: Number,
  speed: Number,
}
```

```
type Point {
  x: Number,
  y: Number,
}
```

```
type Frame {
  x: Number,
  y: Number,
  width: Number,
  height: Number,
}
```

```
type Marker {
  id: String,
  coordinate: LatLng,
  title: String,
  description: String
}
```

```
type KmlContainer {
  markers: [Marker]
}
```

```
type Address {
  name: String,
  thoroughfare: String,
  subThoroughfare: String,
  locality: String,
  subLocality: String,
  administrativeArea: String,
  subAdministrativeArea: String,
  postalCode: String,
  countryCode: String,
  country: String,
}
```
