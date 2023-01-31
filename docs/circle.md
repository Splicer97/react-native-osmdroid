# `<Circle />` Component API

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `center` | `LatLng` | (Required) | The coordinate of the center of the circle
| `radius` | `Number` | (Required) | The radius of the circle to be drawn (in meters)
| `strokeWidth` | `Number` | `1` | The stroke width to use for the path.
| `strokeColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The stroke color to use for the path.
| `fillColor` | `String` | `#000`, `rgba(r,g,b,0.5)` | The fill color to use for the path.


## Types

```
type LatLng {
  latitude: Number,
  longitude: Number,
}
```
