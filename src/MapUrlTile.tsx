import * as React from 'react';

import type {
  NativeComponent,
  MapManagerCommand,
  UIManagerCommand,
} from './decorateMapComponent';
import { requireNativeComponent, ViewProps } from 'react-native';

export type MapUrlTileProps = ViewProps & {
  /**
   * Doubles tile size from 256 to 512 utilising higher zoom levels
   * i.e loading 4 higher zoom level tiles and combining them for one high-resolution tile.
   * iOS does this automatically, even if it is not desirable always.
   * NB! using this makes text labels smaller than in the original map style.
   *
   */
  doubleTileSize?: boolean;

  /**
   * Allow tiles using the TMS coordinate system (origin bottom left) to be used,
   * and displayed at their correct coordinates.
   */
  flipY?: boolean;

  /**
   * The maximum native zoom level for this tile overlay i.e. the highest zoom level that the tile server provides.
   * Tiles are auto-scaled for higher zoom levels.
   */
  maximumNativeZ?: number;

  /**
   * The maximum zoom level for this tile overlay.
   */
  maximumZ?: number;

  /**
   * The minimum zoom level for this tile overlay.
   */
  minimumZ?: number;

  /**
   * In offline-mode tiles are not fetched from the tile servers, rather only tiles stored in the cache directory are used.
   * Furthermore automated tile scaling is activated: if tile at a desired zoom level is not found from the cache directory,
   * then lower zoom level tile is used (up to 4 levels lower) and scaled.
   *
   * @default false
   */
  offlineMode?: boolean;

  /**
   * Map layer opacity. Value between 0 - 1, with 0 meaning fully transparent.
   */
  opacity?: number;

  /**
   * Defines maximum age in seconds for a cached tile before it's refreshed.
   *
   * NB! Refresh logic is "serve-stale-while-refresh"
   * i.e. to ensure map availability a stale (over max age) tile is served
   * while a tile refresh process is started in the background.
   */
  tileCacheMaxAge?: number;

  /**
   * Enable caching of tiles in the specified directory.
   * Directory can be specified either as a normal path or in URL format (`file://`).
   *
   * Tiles are stored in tileCachePath directory as `/{z}/{x}/{y}` i.e. in sub-directories 2-levels deep,
   * filename is tile y-coordinate without any filetype-extension.
   *
   * NB! All cache management needs to be implemented by client e.g. deleting tiles to manage use of storage space etc.
   */
  tileCachePath?: string;

  /**
   * Tile size, default size is 256 (for tiles of 256 _ 256 pixels).
   * High-res (aka 'retina') tiles are 512 (tiles of 512 _ 512 pixels)
   */
  tileSize?: number;

  /**
   * The url template of the map tileserver.
   * (URLTile) The patterns {x} {y} {z} will be replaced at runtime.
   * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png.
   *
   * It is also possible to refer to tiles in local filesystem with file:///top-level-directory/sub-directory/{z}/{x}/{y}.png URL-format.
   * (WMSTile) The patterns {minX} {maxX} {minY} {maxY} {width} {height} will be replaced at runtime according to EPSG:900913 specification bounding box.
   * For example, https://demo.geo-solutions.it/geoserver/tiger/wms?service=WMS&version=1.1.0&request=GetMap&layers=tiger:poi&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true&format_options=dpi:213.
   */

  urlTemplate: string;
};

type NativeProps = MapUrlTileProps;

class MapUrlTile extends React.Component<MapUrlTileProps> {
  getNativeComponent!: () => NativeComponent<NativeProps>;
  getMapManagerCommand!: (name: string) => MapManagerCommand;
  getUIManagerCommand!: (name: string) => UIManagerCommand;

  render() {
    return <OsmMapUrlTile {...this.props} />;
  }
}

const OsmMapUrlTile = requireNativeComponent<NativeProps>('OsmMapUrlTile');

export default MapUrlTile;
