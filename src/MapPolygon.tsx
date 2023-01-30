import * as React from 'react';
import {
  NativeSyntheticEvent,
  requireNativeComponent,
  View,
  ViewProps,
} from 'react-native';
import type { NativeComponent } from './decorateMapComponent';
import type { LatLng, Point } from './sharedTypes';

export type MapPolygonProps = ViewProps & {
  /**
   * An array of coordinates to describe the polygon
   *
   */
  coordinates: LatLng[];

  /**
   * The fill color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   */
  fillColor?: string;

  /**
   * Boolean to indicate whether to draw each segment of the line as a geodesic as opposed to straight lines on the Mercator projection.
   * A geodesic is the shortest path between two points on the Earth's surface.
   * The geodesic curve is constructed assuming the Earth is a sphere.
   *
   */
  geodesic?: boolean;

  /**
   * A 2d array of coordinates to describe holes of the polygon where each hole has at least 3 points.
   *
   */
  holes?: LatLng[][];

  /**
   * Callback that is called when the user presses on the polygon
   *
   */
  onPress?: (event: PolygonPressEvent) => void;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   */
  strokeColor?: string;

  /**
   * The stroke width to use for the path.
   *
   * @default 1
   */
  strokeWidth?: number;

  /**
   * Boolean to allow a polygon to be tappable and use the onPress function.
   *
   */
  tappable?: boolean;
};

type PolygonPressEvent = NativeSyntheticEvent<{
  action: 'polygon-press';
  id?: string;
  coordinate?: LatLng;
  position?: Point;
}>;

type NativeProps = MapPolygonProps & { ref: React.RefObject<View> };

class MapPolygon extends React.Component<MapPolygonProps> {
  private polygon: NativeProps['ref'];

  constructor(props: MapPolygonProps) {
    super(props);
    this.polygon = React.createRef<View>();
  }

  setNativeProps(props: Partial<MapPolygonProps>) {
    this.polygon.current?.setNativeProps(props);
  }

  render() {
    const { strokeColor = '#000', strokeWidth = 1 } = this.props;
    return (
      <OsmMapPolygon
        {...this.props}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        ref={this.polygon}
      />
    );
  }
}

const OsmMapPolygon: NativeComponent<NativeProps> =
  requireNativeComponent<NativeProps>('OsmMapPolygon');

export default MapPolygon;
