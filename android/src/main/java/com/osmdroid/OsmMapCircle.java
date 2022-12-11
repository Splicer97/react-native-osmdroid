package com.osmdroid;

import android.content.Context;

import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Polygon;

public class OsmMapCircle extends OsmMapFeature {

  private Polygon polygon;

  private GeoPoint center;
  private double radius;
  private int strokeColor;
  private int fillColor;
  private float strokeWidth;
  private float zIndex;
  private MapView mapView;

  public OsmMapCircle(Context context) {
    super(context);
  }

  public void setCenter(GeoPoint center) {
    this.center = center;
    if (polygon != null) {
      polygon.setPoints(Polygon.pointsAsCircle(center, radius));
    }
  }

  public void setRadius(double radius) {
    this.radius = radius;
    if (polygon != null) {
      polygon.setPoints(Polygon.pointsAsCircle(center, radius));
    }
  }

  public void setFillColor(int color) {
    this.fillColor = color;
    if (polygon != null) {
      polygon.setFillColor(color);
      mapView.invalidate();
    }
  }

  public void setStrokeColor(int color) {
    this.strokeColor = color;
    if (polygon != null) {
      polygon.setStrokeColor(color);
      mapView.invalidate();
    }
  }

  public void setStrokeWidth(float width) {
    this.strokeWidth = width;
    if (polygon != null) {
      polygon.setStrokeWidth(width);
      mapView.invalidate();
    }
  }

//  public void setZIndex(float zIndex) {
//    this.zIndex = zIndex;
//    if (circle != null) {
//      circle.setZIndex(zIndex);
//    }
//  }

  @Override
  public Object getFeature() {
    return polygon;
  }

  @Override
  public void addToMap(MapView map) {
    polygon = new Polygon();
    mapView = map;
    polygon.setPoints(Polygon.pointsAsCircle(center, radius));
    polygon.setFillColor(fillColor);
    polygon.setStrokeColor(strokeColor);
    polygon.setStrokeWidth(strokeWidth);
    map.getOverlays().add(polygon);
    mapView.invalidate();
  }

  @Override
  public void removeFromMap(MapView map) {
    map.getOverlays().remove(polygon);
    polygon = null;
    mapView = null;
  }
}
