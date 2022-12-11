package com.osmdroid;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class OsmMapFileTileManager extends ViewGroupManager<OsmMapFileTile> {

  public OsmMapFileTileManager() {
    super();
  }

  @Override
  public String getName() {
    return "OsmMapFileTile";
  }

  @Override
  public OsmMapFileTile createViewInstance(ThemedReactContext context) {
    return new OsmMapFileTile(context);
  }

  @ReactProp(name = "minimumZ", defaultFloat = 0.0f)
  public void setMinimumZ(OsmMapFileTile view, float minimumZ) {
    view.setMinimumZ(minimumZ);
  }

  @ReactProp(name = "maximumZ", defaultFloat = 100.0f)
  public void setMaximumZ(OsmMapFileTile view, float maximumZ) {
    view.setMaximumZ(maximumZ);
  }

  @ReactProp(name="fileDirPath")
  public void setFilePath(OsmMapFileTile view, String fileDirPath) {
    view.setFileDirPath(fileDirPath);
  }

  // todo create offline placeholder binding\
  //         //https://github.com/osmdroid/osmdroid/issues/330
  //        //custom image placeholder for files that aren't available
  //        mMapView.getTileProvider().setTileLoadFailureImage(getResources().getDrawable(R
  //        .drawable.notfound));

}
