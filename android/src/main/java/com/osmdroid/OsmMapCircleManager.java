package com.osmdroid;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.osmdroid.util.GeoPoint;

public class OsmMapCircleManager extends ViewGroupManager<OsmMapCircle> {
  private final DisplayMetrics metrics;

  public OsmMapCircleManager(ReactApplicationContext reactContext) {
    super();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      metrics = new DisplayMetrics();
      ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
          .getDefaultDisplay()
          .getRealMetrics(metrics);
    } else {
      metrics = reactContext.getResources().getDisplayMetrics();
    }
  }

  @Override
  public String getName() {
    return "OsmMapCircle";
  }

  @Override
  public OsmMapCircle createViewInstance(ThemedReactContext context) {
    return new OsmMapCircle(context);
  }

  @ReactProp(name = "center")
  public void setCenter(OsmMapCircle view, ReadableMap center) {
    view.setCenter(new GeoPoint(center.getDouble("latitude"), center.getDouble("longitude")));
  }

  @ReactProp(name = "radius", defaultDouble = 0)
  public void setRadius(OsmMapCircle view, double radius) {
    view.setRadius(radius);
  }

  @ReactProp(name = "strokeWidth", defaultFloat = 1f)
  public void setStrokeWidth(OsmMapCircle view, float widthInPoints) {
    float widthInScreenPx = metrics.density * widthInPoints; // done for parity with iOS
    view.setStrokeWidth(widthInScreenPx);
  }

  @ReactProp(name = "fillColor", defaultInt = Color.RED, customType = "Color")
  public void setFillColor(OsmMapCircle view, int color) {
    view.setFillColor(color);
  }

  @ReactProp(name = "strokeColor", defaultInt = Color.RED, customType = "Color")
  public void setStrokeColor(OsmMapCircle view, int color) {
    view.setStrokeColor(color);
  }


}
