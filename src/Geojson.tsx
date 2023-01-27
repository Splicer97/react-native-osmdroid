import * as React from 'react';
import type {
  Feature,
  FeatureCollection,
  Point,
  Position,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from 'geojson';
import Marker, { MapMarkerProps as MarkerProps } from './MapMarker';
import type { MapPolygonProps as PolygonProps } from './MapPolygon';
import type { MapPolylineProps as PolylineProps } from './MapPolyline';
import Polyline from './MapPolyline';
import MapPolygon from './MapPolygon';
import type { LatLng } from './sharedTypes';

export type GeojsonProps = {
  /**
   * The pincolor used on markers
   */
  color?: MarkerProps['pinColor'];

  /**
   * The fill color to use for the path.
   */
  fillColor?: PolygonProps['fillColor'];

  /**
   * [Geojson](https://geojson.org/) description of object.
   */
  geojson: FeatureCollection;

  /**
   * A custom image to be used as the marker's icon. Only local image resources are allowed to be
   * used.
   */
  image?: MarkerProps['image'];

  /**
   * The line cap style to apply to the open ends of the path.
   * The default style is `round`.
   */
  lineCap?: PolylineProps['lineCap'];

  /**
   * An array of numbers specifying the dash pattern to use for the path.
   *
   * The array contains one or more numbers that indicate the lengths (measured in points) of the
   * line segments and gaps in the pattern. The values in the array alternate, starting with the
   * first line segment length, followed by the first gap length, followed by the second line
   * segment length, and so on.
   *
   * This property is set to `null` by default, which indicates no line dash pattern.
   */
  lineDashPattern?: PolylineProps['lineDashPattern'];

  /**
   * Component to render in place of the default marker when the overlay type is a `point`
   */
  markerComponent?: MarkerProps['children'];

  /**
   * Callback that is called when the user presses any of the overlays
   */
  onPress?: (event: OverlayPressEvent) => void;

  /**
   * The stroke color to use for the path.
   */
  strokeColor?: PolygonProps['strokeColor'] | PolylineProps['strokeColor'];

  /**
   * The stroke width to use for the path.
   */
  strokeWidth?: PolygonProps['strokeWidth'] | PolylineProps['strokeWidth'];

  /**
   * Make the `Polygon` or `Polyline` tappable
   */
  tappable?: PolygonProps['tappable'] | PolylineProps['tappable'];

  /**
   * The title of the marker. This is only used if the <Marker /> component has no children that
   * are a `<Callout />`, in which case the default callout behavior will be used, which
   * will show both the `title` and the `description`, if provided.
   */
  title?: MarkerProps['title'];

  /**
   * Sets whether this marker should track view changes.
   * It's recommended to turn it off whenever it's possible to improve custom marker performance.
   * This is the default value for all point markers in your geojson data. It can be overriden
   * on a per point basis by adding a `trackViewChanges` property to the `properties` object on the point.
   *
   * @default true
   */
  tracksViewChanges?: boolean;
};

const Geojson = (props: GeojsonProps) => {
  const {
    geojson,
    strokeColor,
    fillColor,
    strokeWidth,
    color,
    title,
    image,
    onPress,
    lineCap,
    tappable,
    tracksViewChanges,
    lineDashPattern,
    markerComponent,
  } = props;
  const pointOverlays = makePointOverlays(geojson.features);
  const lineOverlays = makeLineOverlays(geojson.features);
  const polygonOverlays = makePolygonOverlays(geojson.features);
  return (
    <React.Fragment>
      {pointOverlays.map((overlay, index) => {
        const markerColor = getColor(color, overlay, 'marker-color');
        const pointOverlayTracksViewChanges =
          overlay.feature.properties?.tracksViewChanges || tracksViewChanges;
        return (
          <Marker
            key={index}
            coordinate={overlay.coordinates}
            tracksViewChanges={pointOverlayTracksViewChanges}
            image={image}
            title={title}
            pinColor={markerColor}
            onPress={() => onPress && onPress(overlay)}
          >
            {markerComponent}
          </Marker>
        );
      })}
      {lineOverlays.map((overlay, index) => {
        const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
        const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);

        return (
          <Polyline
            key={index}
            coordinates={overlay.coordinates}
            strokeColor={lineStrokeColor}
            strokeWidth={lineStrokeWidth}
            lineDashPattern={lineDashPattern}
            lineCap={lineCap}
            tappable={tappable}
            onPress={() => onPress && onPress(overlay)}
          />
        );
      })}
      {polygonOverlays.map((overlay, index) => {
        const polygonFillColor = getColor(fillColor, overlay, 'fill');
        const lineStrokeColor = getColor(strokeColor, overlay, 'stroke');
        const lineStrokeWidth = getStrokeWidth(strokeWidth, overlay);

        return (
          <MapPolygon
            key={index}
            coordinates={overlay.coordinates}
            holes={overlay.holes}
            strokeColor={lineStrokeColor}
            fillColor={polygonFillColor}
            strokeWidth={lineStrokeWidth}
            tappable={tappable}
            onPress={() => onPress && onPress(overlay)}
          />
        );
      })}
    </React.Fragment>
  );
};

export default Geojson;

const makePointOverlays = (features: Feature[]): AnyPointOverlay[] => {
  return features
    .filter(isAnyPointFeature)
    .map((feature) =>
      makeCoordinatesForAnyPoint(feature.geometry).map((coordinates) =>
        makeOverlayForAnyPoint(coordinates, feature)
      )
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map((overlay) => ({ ...overlay, type: 'point' }));
};

const makeLineOverlays = (features: Feature[]): AnyLineStringOverlay[] => {
  return features
    .filter(isAnyLineStringFeature)
    .map((feature) =>
      makeCoordinatesForAnyLine(feature.geometry).map((coordinates) =>
        makeOverlayForAnyLine(coordinates, feature)
      )
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map((overlay) => ({ ...overlay, type: 'polyline' }));
};

const makePolygonOverlays = (features: Feature[]): AnyPolygonOverlay[] => {
  const multipolygons: AnyPolygonOverlay[] = features
    .filter(isMultiPolygonFeature)
    .map((feature) =>
      makeCoordinatesForMultiPolygon(feature.geometry).map((coordinates) =>
        makeOverlayForAnyPolygon(coordinates, feature)
      )
    )
    .reduce((prev, curr) => prev.concat(curr), [])
    .map((overlay) => ({ ...overlay, type: 'polygon' }));

  const polygons: AnyPolygonOverlay[] = features
    .filter(isPolygonFeature)
    .map((feature) =>
      makeOverlayForAnyPolygon(
        makeCoordinatesForPolygon(feature.geometry),
        feature
      )
    )
    .reduce<Omit<AnyPolygonOverlay, 'type'>[]>(
      (prev, curr) => prev.concat(curr),
      []
    )
    .map((overlay) => ({ ...overlay, type: 'polygon' }));

  return polygons.concat(multipolygons);
};

const makeOverlayForAnyPoint = (
  coordinates: LatLng,
  feature: Feature<Point | MultiPoint>
): Omit<AnyPointOverlay, 'type'> => {
  return { feature, coordinates };
};

const makeOverlayForAnyLine = (
  coordinates: LatLng[],
  feature: Feature<LineString | MultiLineString>
): Omit<AnyLineStringOverlay, 'type'> => {
  return { feature, coordinates };
};

const makeOverlayForAnyPolygon = (
  coordinates: LatLng[][],
  feature: Feature<Polygon | MultiPolygon>
): Omit<AnyPolygonOverlay, 'type'> => {
  return {
    feature,
    coordinates: coordinates[0] as LatLng[],
    holes: coordinates.length > 1 ? coordinates.slice(1) : undefined,
  };
};

const makePoint = (c: Position): LatLng => ({
  latitude: c[1] as number,
  longitude: c[0] as number,
});

const makeLine = (l: Position[]) => l.map(makePoint);

const makeCoordinatesForAnyPoint = (geometry: Point | MultiPoint) => {
  if (geometry.type === 'Point') {
    return [makePoint(geometry.coordinates)];
  }
  return geometry.coordinates.map(makePoint);
};

const makeCoordinatesForAnyLine = (geometry: LineString | MultiLineString) => {
  if (geometry.type === 'LineString') {
    return [makeLine(geometry.coordinates)];
  }
  return geometry.coordinates.map(makeLine);
};

const makeCoordinatesForPolygon = (geometry: Polygon) => {
  return geometry.coordinates.map(makeLine);
};

const makeCoordinatesForMultiPolygon = (geometry: MultiPolygon) => {
  return geometry.coordinates.map((p) => p.map(makeLine));
};

const getRgbaFromHex = (hex: string, alpha: number = 1) => {
  const matchArray = hex.match(/\w\w/g);
  if (!matchArray || matchArray.length < 3) {
    throw new Error('Invalid hex string');
  }
  const [r, g, b] = matchArray.map((x) => {
    const subColor = parseInt(x, 16);
    if (Number.isNaN(subColor)) {
      throw new Error('Invalid hex string');
    }
    return subColor;
  });
  return `rgba(${r},${g},${b},${alpha})`;
};

const getColor = (
  prop: string | undefined,
  overlay: Overlay,
  colorType: string
) => {
  if (prop) {
    return prop;
  }
  let color = overlay.feature.properties?.[colorType];
  if (color) {
    const opacityProperty = colorType + '-opacity';
    const alpha = overlay.feature.properties?.[opacityProperty];
    if (alpha && alpha !== '0' && color[0] === '#') {
      color = getRgbaFromHex(color, alpha);
    }
    return color;
  }
  return undefined;
};

const getStrokeWidth = (
  prop: GeojsonProps['strokeWidth'],
  overlay: Overlay
) => {
  if (prop) {
    return prop;
  }
  return overlay.feature.properties?.['stroke-width'];
};

// GeoJSON.Feature type-guards
const isPointFeature = (feature: Feature): feature is Feature<Point> =>
  feature.geometry.type === 'Point';

const isMultiPointFeature = (
  feature: Feature
): feature is Feature<MultiPoint> => feature.geometry.type === 'MultiPoint';

const isAnyPointFeature = (
  feature: Feature
): feature is Feature<Point> | Feature<MultiPoint> =>
  isPointFeature(feature) || isMultiPointFeature(feature);

const isLineStringFeature = (
  feature: Feature
): feature is Feature<LineString> => feature.geometry.type === 'LineString';

const isMultiLineStringFeature = (
  feature: Feature
): feature is Feature<MultiLineString> =>
  feature.geometry.type === 'MultiLineString';

const isAnyLineStringFeature = (
  feature: Feature
): feature is Feature<LineString> | Feature<MultiLineString> =>
  isLineStringFeature(feature) || isMultiLineStringFeature(feature);

const isPolygonFeature = (feature: Feature): feature is Feature<Polygon> =>
  feature.geometry.type === 'Polygon';

const isMultiPolygonFeature = (
  feature: Feature
): feature is Feature<MultiPolygon> => feature.geometry.type === 'MultiPolygon';

type OverlayPressEvent = {
  type:
    | AnyPointOverlay['type']
    | AnyLineStringOverlay['type']
    | AnyPolygonOverlay['type'];
  feature:
    | AnyPointOverlay['feature']
    | AnyLineStringOverlay['feature']
    | AnyPolygonOverlay['feature'];
  coordinates:
    | AnyPointOverlay['coordinates']
    | AnyLineStringOverlay['coordinates']
    | AnyPolygonOverlay['coordinates'];
  holes?: AnyPolygonOverlay['holes'];
};

type AnyPointOverlay = {
  type: 'point';
  feature: Feature<Point | MultiPoint>;
  coordinates: LatLng;
};

type AnyLineStringOverlay = {
  type: 'polyline';
  feature: Feature<LineString | MultiLineString>;
  coordinates: LatLng[];
};

type AnyPolygonOverlay = {
  type: 'polygon';
  feature: Feature<Polygon | MultiPolygon>;
  coordinates: LatLng[];
  holes?: LatLng[][];
};

type Overlay = {
  type: 'point' | 'polyline' | 'polygon';
  feature: Feature;
  coordinates: LatLng | LatLng[];
  holes?: LatLng[][];
};
