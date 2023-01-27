import * as React from 'react';
import { requireNativeComponent, View, ViewProps } from 'react-native';
import type {
  NativeComponent,
  MapManagerCommand,
  UIManagerCommand,
} from './decorateMapComponent';
import type { LatLng } from './sharedTypes';

export type MapCircleProps = ViewProps & {
  /**
   * The coordinates of the center of the circle.
   *
   */
  center: LatLng;

  /**
   * The fill color to use for the path.
   *
   * @default `#000`, `rgba(r,g,b,0.5)`
   */
  fillColor?: string;

  /**
   * The radius of the circle to be drawn (in meters)
   *
   */
  radius: number;

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
};

type NativeProps = MapCircleProps & { ref: React.RefObject<View> };

class MapCircle extends React.Component<MapCircleProps> {
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  private circle: NativeProps['ref'];

  constructor(props: MapCircleProps) {
    super(props);
    this.circle = React.createRef<View>();
  }

  setNativeProps(props: Partial<NativeProps>) {
    this.circle.current?.setNativeProps(props);
  }

  render() {
    const { strokeColor = '#000', strokeWidth = 1 } = this.props;

    return (
      <OsmMapCircle
        {...this.props}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        ref={this.circle}
      />
    );
  }
}

const OsmMapCircle: NativeComponent<NativeProps> =
  requireNativeComponent<NativeProps>('OsmMapCircle');

export default MapCircle;
