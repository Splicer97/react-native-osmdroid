# `<Polygon />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `coordinates` | `Array<LatLng>` | (Required) | An array of coordinates to describe the polygon
| `holes` | `Array<Array<LatLng>>` |  | A 2d array of coordinates to describe holes of the polygon where each hole has at least 3 points.
| `strokeWidth` | `Number` | `1` | The stroke width to use for the path.
| `strokeColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The stroke color to use for the path.
| `fillColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The fill color to use for the path.
| `geodesic` | `Boolean` |  | Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection. A geodesic is the shortest path between two points on the Earth's surface. The geodesic curve is constructed assuming the Earth is a sphere.
| `tappable` | `Bool` | `false` | Boolean to allow a polygon to be tappable and use the onPress function.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onPress` |  | Callback that is called when the user presses on the polygon

## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```
