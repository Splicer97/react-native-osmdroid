package com.osmdroid;

import android.content.Context;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Polygon;

import java.util.ArrayList;
import java.util.List;

public class OsmMapPolygon extends OsmMapFeature {

  private Polygon polygon;

  private List<GeoPoint> coordinates;
  private int strokeColor;
  private int fillColor;
  private float strokeWidth;
  private MapView mapView;

  public OsmMapPolygon(Context context) {
    super(context);
  }

  public void setCoordinates(ReadableArray coordinates) {
    // it's kind of a bummer that we can't run map() or anything on the ReadableArray
    this.coordinates = new ArrayList<>(coordinates.size()+1);
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.coordinates.add(i,
          new GeoPoint(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
    this.coordinates.add(this.coordinates.get(0));
    if (polygon != null) {
      polygon.setPoints(this.coordinates);
      mapView.invalidate();
    }
  }

  public void setFillColor(int color) {
    this.fillColor = color;
    if (polygon != null) {
      polygon.getFillPaint().setColor(color);
      mapView.invalidate();
    }
  }

  public void setStrokeColor(int color) {
    this.strokeColor = color;
    if (polygon != null) {
      polygon.getOutlinePaint().setColor(color);
      mapView.invalidate();
    }
  }

  public void setStrokeWidth(float width) {
    this.strokeWidth = width;
    if (polygon != null) {
      polygon.getOutlinePaint().setStrokeWidth(width);
      mapView.invalidate();
    }
  }


  @Override
  public Object getFeature() {
    return polygon;
  }

  @Override
  public void addToMap(MapView map) {
    polygon = new Polygon();
    mapView = map;
    polygon.setPoints(coordinates);
    polygon.getFillPaint().setColor(fillColor);
    polygon.getOutlinePaint().setColor(strokeColor);
    polygon.getOutlinePaint().setStrokeWidth(strokeWidth);
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
