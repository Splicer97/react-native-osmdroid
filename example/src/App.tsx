import * as React from 'react';

import { StyleSheet } from 'react-native';
import { OsmdroidView } from 'react-native-osmdroid';

export default function App() {
  return <OsmdroidView style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
