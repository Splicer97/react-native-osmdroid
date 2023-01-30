import * as React from 'react';
import {
  StyleSheet,
  Animated,
  Image,
  ViewProps,
  ImageURISource,
  ImageRequireSource,
  requireNativeComponent,
} from 'react-native';

import type { NativeComponent } from './decorateMapComponent';
import {
  Commands,
  MapMarkerNativeComponentType,
} from './MapMarkerNativeComponent';
import type {
  CalloutPressEvent,
  LatLng,
  MarkerDragEvent,
  MarkerDragStartEndEvent,
  MarkerPressEvent,
  Point,
} from './sharedTypes';
import type { Modify } from './sharedTypesInternal';

export type MapMarkerProps = ViewProps & {
  /**
   * Sets the anchor point for the marker.
   * The anchor specifies the point in the icon image that is anchored to the marker's position on the Earth's surface.
   *
   * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],
   * where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.
   *
   * The anchoring point in a W x H image is the nearest discrete grid point in a (W + 1) x (H + 1) grid, obtained by scaling the then rounding.
   * For example, in a 4 x 2 image, the anchor point (0.7, 0.6) resolves to the grid point at (3, 1).
   *
   * @default {x: 0.5, y: 1.0}
   */
  anchor?: Point;

  /**
   * Specifies the point in the marker image at which to anchor the callout when it is displayed.
   * This is specified in the same coordinate system as the anchor.
   *
   * See the `anchor` prop for more details.
   *
   * @default {x: 0.5, y: 0.0}
   */
  calloutAnchor?: Point;

  /**
   * The coordinate for the marker.
   */
  coordinate: LatLng;

  /**
   * The description of the marker.
   *
   * This is only used if the <Marker /> component has no children that are a `<Callout />`,
   * in which case the default callout behavior will be used,
   * which will show both the `title` and the `description`, if provided.
   */
  description?: string;

  /**
   * if `true` allows the marker to be draggable (re-positioned).
   *
   * @default false
   */
  draggable?: boolean;

  /**
   * Sets whether this marker should be flat against the map true or a billboard facing the camera.
   *
   * @default false
   */
  flat?: boolean;

  /**
   * Marker icon to render (equivalent to `icon` property of GMSMarker Class).
   * Only local image resources are allowed to be used.
   */
  icon?: ImageURISource | ImageRequireSource;

  /**
   * A string that can be used to identify this marker.
   */
  identifier?: string;

  /**
   * A custom image to be used as the marker's icon. Only local image resources are allowed to be used.
   */
  image?: ImageURISource | ImageRequireSource;

  /**
   * Callback that is called when the user taps the callout view.
   */
  onCalloutPress?: (event: CalloutPressEvent) => void;

  /**
   * Callback called continuously as the marker is dragged
   */
  onDrag?: (event: MarkerDragEvent) => void;

  /**
   * Callback that is called when a drag on the marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   */
  onDragEnd?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when the user initiates a drag on the marker (if it is draggable)
   */
  onDragStart?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when the marker is tapped by the user.
   */
  onPress?: (event: MarkerPressEvent) => void;

  /**
   * The marker's opacity between 0.0 and 1.0.
   *
   * @default 1.0
   */
  opacity?: number;

  /**
   * If no custom marker view or custom image is provided, the platform default pin will be used, which can be customized by this color.
   * Ignored if a custom marker is being used.<br/><br/>
   */
  pinColor?: string;

  /**
   * A float number indicating marker's rotation angle, in degrees.
   *
   * @default 0
   */
  rotation?: number;

  /**
   * The title of the marker.
   * This is only used if the <Marker /> component has no `<Callout />` children.
   *
   * If the marker has <Callout /> children, default callout behavior will be used,
   * which will show both the `title` and the `description`, if provided.
   *
   */
  title?: string;

  /**
   * Sets whether this marker should track view changes.
   * It's recommended to turn it off whenever it's possible to improve custom marker performance.
   *
   * @default true
   */
  tracksViewChanges?: boolean;
};

type OmittedProps = Omit<MapMarkerProps, 'stopPropagation'>;

export type NativeProps = Modify<
  OmittedProps,
  {
    icon?: string;
    image?: MapMarkerProps['image'] | string;
  }
> & {
  ref: React.RefObject<MapMarkerNativeComponentType>;
};

class MapMarker extends React.Component<MapMarkerProps> {
  static Animated: Animated.AnimatedComponent<typeof MapMarker>;

  private marker: NativeProps['ref'];

  constructor(props: MapMarkerProps) {
    super(props);

    this.marker = React.createRef<MapMarkerNativeComponentType>();
    this.showCallout = this.showCallout.bind(this);
    this.hideCallout = this.hideCallout.bind(this);
    this.redrawCallout = this.redrawCallout.bind(this);
    this.animateMarkerToCoordinate = this.animateMarkerToCoordinate.bind(this);
  }

  /**
   * @deprecated Will be removed in v2.0.0, as setNativeProps is not a thing in fabric.
   * See https://reactnative.dev/docs/new-architecture-library-intro#migrating-off-setnativeprops
   */
  setNativeProps(props: Partial<NativeProps>) {
    console.warn(
      'setNativeProps is deprecated and will be removed in next major release'
    );
    // @ts-ignore
    this.marker.current?.setNativeProps(props);
  }

  showCallout() {
    if (this.marker.current) {
      Commands.showCallout(this.marker.current);
    }
  }

  hideCallout() {
    if (this.marker.current) {
      Commands.hideCallout(this.marker.current);
    }
  }

  redrawCallout() {
    if (this.marker.current) {
      Commands.redrawCallout(this.marker.current);
    }
  }

  animateMarkerToCoordinate(coordinate: LatLng, duration: number = 500) {
    if (this.marker.current) {
      Commands.animateMarkerToCoordinate(
        this.marker.current,
        coordinate,
        duration
      );
    }
  }

  redraw() {
    if (this.marker.current) {
      Commands.redraw(this.marker.current);
    }
  }

  render() {
    let image;
    if (this.props.image) {
      image = Image.resolveAssetSource(this.props.image) || {};
      image = image.uri || this.props.image;
    }

    let icon;
    if (this.props.icon) {
      icon = Image.resolveAssetSource(this.props.icon) || {};
      icon = icon.uri;
    }

    return (
      <OsmMapMarker
        {...this.props}
        ref={this.marker}
        image={image}
        icon={icon}
        style={[styles.marker, this.props.style]}
        onPress={(event: MarkerPressEvent) => {
          if (this.props.onPress) {
            this.props.onPress(event);
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

MapMarker.Animated = Animated.createAnimatedComponent(MapMarker);

const OsmMapMarker: NativeComponent<NativeProps> =
  requireNativeComponent<NativeProps>('OsmMapMarker');

export default MapMarker;
