package com.osmdroid;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class OsmdroidPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    OsmdroidViewManager osmdroidViewManager = new OsmdroidViewManager();
    OsmMapCalloutManager osmCalloutManager = new OsmMapCalloutManager();
    OsmMapMarkerManager osmMarkerManager = new OsmMapMarkerManager();
    OsmMapPolylineManager osmPolylineManager = new OsmMapPolylineManager(reactContext);
    OsmMapPolygonManager osmPolygonManager = new OsmMapPolygonManager(reactContext);
    OsmMapCircleManager osmMapCircleManager = new OsmMapCircleManager(reactContext);
    OsmMapManager osmMapManager = new OsmMapManager(reactContext);
    OsmMapUrlTileManager osmUrlTileManager = new OsmMapUrlTileManager();
    OsmMapFileTileManager osmMapFileTileManager = new OsmMapFileTileManager();
    return Arrays.<ViewManager>asList(
      osmdroidViewManager,
      osmCalloutManager,
      osmMarkerManager,
      osmPolylineManager,
      osmPolygonManager,
      osmMapCircleManager,
      osmMapManager,
      osmUrlTileManager,
      osmMapFileTileManager);
  }
}
