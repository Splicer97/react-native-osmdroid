import {
  Platform,
  requireNativeComponent,
  UIManager,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-osmdroid' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go';

type OsmdroidProps = {
  style: ViewStyle;
};

const ComponentName = 'OsmMap';

export const OsmdroidView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<OsmdroidProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
