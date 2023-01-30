import * as React from 'react';
import { requireNativeComponent, StyleSheet, ViewProps } from 'react-native';
import type { CalloutPressEvent } from './sharedTypes';

export type MapCalloutProps = ViewProps & {
  /**
   * Callback that is called when the user presses on the callout
   *
   */
  onPress?: (event: CalloutPressEvent) => void;

  /**
   * If `false`, a default "tooltip" bubble window will be drawn around this callouts children.
   * If `true`, the child views can fully customize their appearance, including any "bubble" like styles.
   *
   * @default false
   */
  tooltip?: boolean;
};

type NativeProps = MapCalloutProps;

class MapCallout extends React.Component<MapCalloutProps> {
  render() {
    const { tooltip = false } = this.props;
    return (
      <OsmMapCallout
        {...this.props}
        tooltip={tooltip}
        style={[styles.callout, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
  },
});

const OsmMapCallout = requireNativeComponent<NativeProps>('OsmMapCallout');

export default MapCallout;
