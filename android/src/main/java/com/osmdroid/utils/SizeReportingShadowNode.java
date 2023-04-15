
package com.osmdroid.utils;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

import java.util.HashMap;
import java.util.Map;

// Custom LayoutShadowNode implementation used in conjunction with the AirMapManager
// which sends the width/height of the view after layout occurs.
public class SizeReportingShadowNode extends LayoutShadowNode {

  @Override
  public void onCollectExtraUpdates(UIViewOperationQueue uiViewOperationQueue) {
    super.onCollectExtraUpdates(uiViewOperationQueue);

    Map<String, Float> data = new HashMap<>();
    data.put("width", getLayoutWidth());
    data.put("height", getLayoutHeight());

    uiViewOperationQueue.enqueueUpdateExtraData(getReactTag(), data);
  }
}
