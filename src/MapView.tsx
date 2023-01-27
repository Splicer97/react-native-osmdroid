import React from 'react';
import {
  Animated,
  findNodeHandle,
  NativeModules,
  NativeSyntheticEvent,
  Platform,
  requireNativeComponent,
  UIManager,
  ViewProps,
} from 'react-native';
import type {
  Camera,
  MapStyleElement,
  EdgePadding,
  MapType,
  IndoorBuildingEvent,
  IndoorLevelActivatedEvent,
  KmlMapEvent,
  LongPressEvent,
  PanDragEvent,
  PoiClickEvent,
  MapPressEvent,
  Details,
  UserLocationChangeEvent,
  ChangeEvent,
  Address,
  BoundingBox,
  FitToOptions,
  SnapshotOptions,
} from './MapView.types';
import { Commands, MapViewNativeComponentType } from './MapViewNativeComponent';
import type {
  Point,
  Region,
  CalloutPressEvent,
  ClickEvent,
  MarkerDragEvent,
  MarkerDragStartEndEvent,
  MarkerPressEvent,
  LatLng,
} from './sharedTypes';
import type { Modify } from './sharedTypesInternal';

type ModifiedProps = Modify<
  MapViewProps,
  {
    region?: MapViewProps['region'] | null;
    initialRegion?: MapViewProps['initialRegion'] | null;
  }
>;

export type NativeProps = Omit<
  ModifiedProps,
  'customMapStyle' | 'onRegionChange' | 'onRegionChangeComplete'
> & {
  ref: React.RefObject<MapViewNativeComponentType>;
  customMapStyleString?: string;
  handlePanDrag?: boolean;
  onChange?: (e: ChangeEvent) => void;
};

export type MapViewProps = ViewProps & {
  /**
   * If `true` map will be cached and displayed as an image instead of being interactable, for performance usage.
   *
   * @default false
   */
  cacheEnabled?: boolean;

  /**
   * The camera view the map should display.
   *
   * Use the camera system, instead of the region system, if you need control over
   * the pitch or heading. Using this will ignore the `region` property.
   */
  camera?: Camera;

  /**
   * Adds custom styling to the map component.
   */
  customMapStyle?: MapStyleElement[];

  /**
   * The initial camera view the map should use.  Use this prop instead of `camera`
   * only if you don't want to control the camera of the map besides the initial view.
   *
   * Use the camera system, instead of the region system, if you need control over
   * the pitch or heading.
   *
   * Changing this prop after the component has mounted will not result in a camera change.
   *
   * This is similar to the `initialValue` prop of a text input.
   *
   */
  initialCamera?: Camera;

  /**
   * The initial region to be displayed by the map.  Use this prop instead of `region`
   * only if you don't want to control the viewport of the map besides the initial region.
   *
   * Changing this prop after the component has mounted will not result in a region change.
   *
   * This is similar to the `initialValue` prop of a text input.
   *
   */
  initialRegion?: Region;

  /**
   * The URL for KML file.
   *
   */
  kmlSrc?: string;

  /**
   * Sets loading background color.
   *
   * @default `#FFFFFF`
   */
  loadingBackgroundColor?: string;

  /**
   * If `true` a loading indicator will show while the map is loading.
   *
   * @default false
   */
  loadingEnabled?: boolean;

  /**
   * Sets loading indicator color.
   *
   * @default `#606060`
   */
  loadingIndicatorColor?: string;

  /**
   * Adds custom padding to each side of the map. Useful when map elements/markers are obscured.
   *
   */
  mapPadding?: EdgePadding;

  /**
   * The map type to be displayed
   *
   * @default `standard`
   * hybrid | none | sattelite | standard | terrain
   */
  mapType?: MapType;

  /**
   * Maximum zoom value for the map, must be between 0 and 20
   *
   * @default 20
   */
  maxZoomLevel?: number;

  /**
   * Minimum zoom value for the map, must be between 0 and 20
   *
   * @default 0
   */
  minZoomLevel?: number;

  /**
   * If `false` the map won't move to the marker when pressed.
   *
   * @default true
   * @platform iOS: Not supported
   * @platform Android: Supported
   */
  moveOnMarkerPress?: boolean;

  /**
   * Callback that is called when a callout is tapped by the user.
   *
   */
  onCalloutPress?: (event: CalloutPressEvent) => void;

  /**
   * Callback that is called when user double taps on the map.
   *
   */
  onDoublePress?: (event: ClickEvent) => void;

  /**
   * Callback that is called when an indoor building is focused/unfocused
   *
   */
  onIndoorBuildingFocused?: (event: IndoorBuildingEvent) => void;

  /**
   * Callback that is called when a level on indoor building is activated
   *
   */
  onIndoorLevelActivated?: (event: IndoorLevelActivatedEvent) => void;

  /**
   * Callback that is called once the kml is fully loaded.
   *
   */
  onKmlReady?: (event: KmlMapEvent) => void;

  /**
   * Callback that is called when user makes a "long press" somewhere on the map.
   *
   */
  onLongPress?: (event: LongPressEvent) => void;

  /**
   * Callback that is called when the map has finished rendering all tiles.
   *
   */
  onMapLoaded?: (event: NativeSyntheticEvent<{}>) => void;

  /**
   * Callback that is called once the map is ready.
   *
   * Event is optional, as the first onMapReady callback is intercepted
   * on Android, and the event is not passed on.
   *
   */
  onMapReady?: (event?: NativeSyntheticEvent<{}>) => void;

  /**
   * Callback called continuously as a marker is dragged
   *
   */
  onMarkerDrag?: (event: MarkerDragEvent) => void;

  /**
   * Callback that is called when a drag on a marker finishes.
   * This is usually the point you will want to setState on the marker's coordinate again
   *
   */
  onMarkerDragEnd?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when the user initiates a drag on a marker (if it is draggable)
   *
   */
  onMarkerDragStart?: (event: MarkerDragStartEndEvent) => void;

  /**
   * Callback that is called when a marker on the map is tapped by the user.
   *
   */
  onMarkerPress?: (event: MarkerPressEvent) => void;

  /**
   * Callback that is called when user presses and drags the map.
   *
   */
  onPanDrag?: (event: PanDragEvent) => void;

  /**
   * Callback that is called when user click on a POI.
   *
   */
  onPoiClick?: (event: PoiClickEvent) => void;

  /**
   * Callback that is called when user taps on the map.
   *
   */
  onPress?: (event: MapPressEvent) => void;

  /**
   * Callback that is called continuously when the region changes, such as when a user is dragging the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   *
   */
  onRegionChange?: (region: Region, details: Details) => void;

  /**
   * Callback that is called once when the region changes, such as when the user is done moving the map.
   * `isGesture` property indicates if the move was from the user (true) or an animation (false).
   *
   */
  onRegionChangeComplete?: (region: Region, details: Details) => void;

  /**
   * Callback that is called when the underlying map figures our users current location
   * (coordinate also includes isFromMockProvider value for Android API 18 and above).
   * Make sure **showsUserLocation** is set to *true*.
   *
   */
  onUserLocationChange?: (event: UserLocationChangeEvent) => void;

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   */
  pitchEnabled?: boolean;

  /**
   * The region to be displayed by the map.
   * The region is defined by the center coordinates and the span of coordinates to display.
   *
   */
  region?: Region;

  /**
   * If `false` the user won't be able to adjust the camera’s pitch angle.
   *
   * @default true
   */
  rotateEnabled?: boolean;

  /**
   * If `false` the map will stay centered while rotating or zooming.
   *
   * @default true
   */
  scrollDuringRotateOrZoomEnabled?: boolean;

  /**
   * If `false` the user won't be able to change the map region being displayed.
   *
   * @default true
   */
  scrollEnabled?: boolean;

  /**
   * A Boolean indicating whether the map displays extruded building information.
   *
   * @default true
   */
  showsBuildings?: boolean;

  /**
   * If `false` compass won't be displayed on the map.
   *
   * @default true
   */
  showsCompass?: boolean;

  /**
   * A Boolean indicating whether indoor level picker should be enabled.
   *
   * @default false
   */
  showsIndoorLevelPicker?: boolean;

  /**
   * A Boolean indicating whether indoor maps should be enabled.
   *
   * @default true
   */
  showsIndoors?: boolean;

  /**
   * If `false` hide the button to move map to the current user's location.
   *
   * @default true
   */
  showsMyLocationButton?: boolean;

  /**
   * If `true` the users location will be displayed on the map.
   *
   */
  showsUserLocation?: boolean;

  /**
   * If `false` will hide 'Navigate' and 'Open in Maps' buttons on marker press
   *
   * @default true
   */
  toolbarEnabled?: boolean;

  /**
   * Fastest interval the application will actively acquire locations.
   * @default 5000
   */
  userLocationFastestInterval?: number;

  /**
   * Set power priority of user location tracking.
   * @default `high`
   */
  userLocationPriority?: 'balanced' | 'high' | 'low' | 'passive';

  /**
   * Interval of user location updates in milliseconds.
   * @default 5000
   */
  userLocationUpdateInterval?: number;

  /**
   * If `false` the zoom control at the bottom right of the map won't be visible.
   *
   * @default true
   */
  zoomControlEnabled?: boolean;

  /**
   * If `false` the user won't be able to pinch/zoom the map.
   * @default true
   */
  zoomEnabled?: boolean;
};

type State = {
  isReady: boolean;
};

class MapView extends React.Component<MapViewProps, State> {
  static Animated: Animated.AnimatedComponent<typeof MapView>;
  private map: NativeProps['ref'];

  constructor(props: MapViewProps) {
    super(props);

    this.map = React.createRef<MapViewNativeComponentType>();

    this.state = {
      isReady: false,
    };

    this._onMapReady = this._onMapReady.bind(this);
    this._onChange = this._onChange.bind(this);
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
    this.map.current?.setNativeProps(props);
  }

  private _onMapReady() {
    const { onMapReady } = this.props;
    this.setState({ isReady: true }, () => {
      if (onMapReady) {
        onMapReady();
      }
    });
  }

  private _onChange({ nativeEvent }: ChangeEvent) {
    const isGesture = nativeEvent.isGesture;
    const details = { isGesture };

    if (nativeEvent.continuous) {
      if (this.props.onRegionChange) {
        this.props.onRegionChange(nativeEvent.region, details);
      }
    } else if (this.props.onRegionChangeComplete) {
      this.props.onRegionChangeComplete(nativeEvent.region, details);
    }
  }

  getCamera(): Promise<Camera> {
    return NativeModules.OsmMapModule.getCamera(this._getHandle());
  }

  setCamera(camera: Partial<Camera>) {
    if (this.map.current) {
      Commands.setCamera(this.map.current, camera);
    }
  }

  animateCamera(camera: Partial<Camera>, opts?: { duration?: number }) {
    if (this.map.current) {
      Commands.animateCamera(
        this.map.current,
        camera,
        opts?.duration ? opts.duration : 500
      );
    }
  }

  animateToRegion(region: Region, duration: number = 500) {
    if (this.map.current) {
      Commands.animateToRegion(this.map.current, region, duration);
      console.log('animateToRegion');
    }
  }

  fitToElements(options: FitToOptions = {}) {
    if (this.map.current) {
      const {
        edgePadding = { top: 0, right: 0, bottom: 0, left: 0 },
        animated = true,
      } = options;

      Commands.fitToElements(this.map.current, edgePadding, animated);
    }
  }

  fitToSuppliedMarkers(markers: string[], options: FitToOptions = {}) {
    if (this.map.current) {
      const {
        edgePadding = { top: 0, right: 0, bottom: 0, left: 0 },
        animated = true,
      } = options;

      Commands.fitToSuppliedMarkers(
        this.map.current,
        markers,
        edgePadding,
        animated
      );
    }
  }

  fitToCoordinates(coordinates: LatLng[] = [], options: FitToOptions = {}) {
    if (this.map.current) {
      const {
        edgePadding = { top: 0, right: 0, bottom: 0, left: 0 },
        animated = true,
      } = options;

      Commands.fitToCoordinates(
        this.map.current,
        coordinates,
        edgePadding,
        animated
      );
    }
  }

  /**
   * Get visible boudaries
   *
   * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  async getMapBoundaries(): Promise<BoundingBox> {
    return await NativeModules.OsmMapModule.getMapBoundaries(this._getHandle());
  }

  setMapBoundaries(northEast: LatLng, southWest: LatLng) {
    if (this.map.current) {
      Commands.setMapBoundaries(this.map.current, northEast, southWest);
    }
  }

  setIndoorActiveLevelIndex(activeLevelIndex: number) {
    if (this.map.current) {
      Commands.setIndoorActiveLevelIndex(this.map.current, activeLevelIndex);
    }
  }

  /**
   * Takes a snapshot of the map and saves it to a picture
   * file or returns the image as a base64 encoded string.
   *
   * @param args Configuration options
   * @param [args.width] Width of the rendered map-view (when omitted actual view width is used).
   * @param [args.height] Height of the rendered map-view (when omitted actual height is used).
   * @param [args.region] Region to render (Only supported on iOS).
   * @param [args.format] Encoding format ('png', 'jpg') (default: 'png').
   * @param [args.quality] Compression quality (only used for jpg) (default: 1.0).
   * @param [args.result] Result format ('file', 'base64') (default: 'file').
   *
   * @return Promise Promise with either the file-uri or base64 encoded string
   */
  takeSnapshot(args: SnapshotOptions): Promise<string> {
    // Sanitize inputs
    const config = {
      width: args.width || 0,
      height: args.height || 0,
      region: args.region || {},
      format: args.format || 'png',
      quality: args.quality || 1.0,
      result: args.result || 'file',
    };
    if (config.format !== 'png' && config.format !== 'jpg') {
      throw new Error('Invalid format specified');
    }
    if (config.result !== 'file' && config.result !== 'base64') {
      throw new Error('Invalid result specified');
    }
    // Call native function
    return NativeModules.OsmMapModule.takeSnapshot(this._getHandle(), config);
  }

  /**
   * Convert a coordinate to address by using default Geocoder
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise with return type Address
   */
  addressForCoordinate(coordinate: LatLng): Promise<Address> {
    return NativeModules.OsmMapModule.getAddressFromCoordinates(
      this._getHandle(),
      coordinate
    );
  }

  /**
   * Convert a map coordinate to user-space point
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise Promise with the point ({ x: Number, y: Number })
   */
  pointForCoordinate(coordinate: LatLng): Promise<Point> {
    return NativeModules.OsmMapModule.pointForCoordinate(
      this._getHandle(),
      coordinate
    );
  }

  /**
   * Convert a user-space point to a map coordinate
   *
   * @param point Point
   * @param [point.x] X
   * @param [point.x] Y
   *
   * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
   */
  coordinateForPoint(point: Point): Promise<LatLng> {
    return NativeModules.OsmMapModule.coordinateForPoint(
      this._getHandle(),
      point
    );
  }

  /**
   * Get bounding box from region
   *
   * @param region Region
   *
   * @return Object Object bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  boundingBoxForRegion(region: Region): BoundingBox {
    return {
      northEast: {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude + region.longitudeDelta / 2,
      },
      southWest: {
        latitude: region.latitude - region.latitudeDelta / 2,
        longitude: region.longitude - region.longitudeDelta / 2,
      },
    };
  }

  private _getHandle() {
    return findNodeHandle(this.map.current);
  }

  render() {
    let props: NativeProps;

    if (this.state.isReady) {
      props = {
        region: null,
        initialRegion: null,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        ref: this.map,
        customMapStyleString: this.props.customMapStyle
          ? JSON.stringify(this.props.customMapStyle)
          : undefined,
        ...this.props,
      };

      if (props.onPanDrag) {
        props.handlePanDrag = !!props.onPanDrag;
      }
    } else {
      props = {
        style: this.props.style,
        region: null,
        initialRegion: this.props.initialRegion || null,
        initialCamera: this.props.initialCamera,
        ref: this.map,
        onChange: this._onChange,
        onMapReady: this._onMapReady,
        onLayout: this.props.onLayout,
        customMapStyleString: this.props.customMapStyle
          ? JSON.stringify(this.props.customMapStyle)
          : undefined,
      };
    }

    return <OsmMap {...props} />;
  }
}
const ComponentName = 'OsmMap';

const SUPPORT_ERROR = `react-native-osmdroid doesn't support ${Platform.OS}`;

const OsmMap =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<NativeProps>(ComponentName)
    : () => {
        throw new Error(SUPPORT_ERROR);
      };
const AnimatedMapView = Animated.createAnimatedComponent(MapView);

MapView.Animated = AnimatedMapView;

export const enableLatestRenderer = () => {
  return NativeModules.OsmMapModule.enableLatestRenderer();
};

export default MapView;
