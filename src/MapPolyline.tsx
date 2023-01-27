import * as React from 'react';
import {
  NativeSyntheticEvent,
  requireNativeComponent,
  View,
  ViewProps,
} from 'react-native';
import type {
  NativeComponent,
  MapManagerCommand,
  UIManagerCommand,
} from './decorateMapComponent';
import type { LatLng, LineCapType, Point } from './sharedTypes';

export type MapPolylineProps = ViewProps & {
  /**
   * An array of coordinates to describe the polyline
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
   */
  geodesic?: boolean;

  /**
   * The line cap style to apply to the open ends of the path
   *
   * @default `round`
   */
  lineCap?: LineCapType;

  /**
   * An array of numbers specifying the dash pattern to use for the path.
   * The array contains one or more numbers that indicate the lengths (measured in points)
   * of the line segments and gaps in the pattern.
   * The values in the array alternate, starting with the first line segment length,
   * followed by the first gap length, followed by the second line segment length, and so on.
   */
  lineDashPattern?: number[];

  /**
   * Callback that is called when the user presses on the polyline
   */
  onPress?: (event: PolylinePressEvent) => void;

  /**
   * The stroke color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   */
  strokeColor?: string;

  /**
   * The stroke colors to use for the path.
   *
   * Must be the same length as `coordinates`
   */
  strokeColors?: string[];

  /**
   * The stroke width to use for the path.
   *
   * @default 1
   */
  strokeWidth?: number;

  /**
   * Boolean to allow the polyline to be tappable and use the onPress function.
   */
  tappable?: boolean;
};

type PolylinePressEvent = NativeSyntheticEvent<{
  action: 'polyline-press';
  id?: string;
  coordinate?: LatLng;
  position?: Point;
}>;

type NativeProps = MapPolylineProps & { ref: React.RefObject<View> };

class MapPolyline extends React.Component<MapPolylineProps> {
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  private polyline: NativeProps['ref'];

  constructor(props: MapPolylineProps) {
    super(props);
    this.polyline = React.createRef<View>();
  }

  setNativeProps(props: Partial<NativeProps>) {
    this.polyline.current?.setNativeProps(props);
  }

  render() {
    const {
      strokeColor = '#000',
      strokeWidth = 1,
      lineCap = 'round',
    } = this.props;

    return (
      <OsmMapPolyline
        {...this.props}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        lineCap={lineCap}
        ref={this.polyline}
      />
    );
  }
}

const OsmMapPolyline: NativeComponent<NativeProps> =
  requireNativeComponent<NativeProps>('OsmMapPolyline');

export default MapPolyline;
