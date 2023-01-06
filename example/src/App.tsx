import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-osmdroid';

export default function App() {
  const initialRegion: Region = {
    latitude: 55.75222,
    longitude: 37.61556,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  return (
    <MapView style={styles.container} initialRegion={initialRegion}>
      <Marker
        coordinate={{
          latitude: 55.75222,
          longitude: 37.61556,
        }}
      >
        <Text>123</Text>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
