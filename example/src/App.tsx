import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import MapView, {
  Callout,
  Circle,
  Marker,
  Polygon,
  Polyline,
  Region,
  UrlTile,
} from 'react-native-osmdroid';

export default function App() {
  const initialRegion: Region = {
    latitude: 55.75222,
    longitude: 37.61556,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  const toner =
    'https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=j46yoHMlBMQRgTY3lCMk';
  return (
    <MapView style={styles.container} initialRegion={initialRegion}>
      <Marker
        coordinate={{
          latitude: 55.75222,
          longitude: 37.61556,
        }}
      >
        <Text>Marker</Text>
        <Callout>
          <Text>Callout</Text>
        </Callout>
      </Marker>
      <Polyline
        strokeColor="red"
        strokeWidth={30}
        coordinates={[
          {
            latitude: 55.7521,
            longitude: 37.60556,
          },
          {
            latitude: 55.75223,
            longitude: 37.61557,
          },
          {
            latitude: 55.75224,
            longitude: 37.61558,
          },
        ]}
      />
      <Polygon
        strokeColor="blue"
        strokeWidth={30}
        coordinates={[
          {
            latitude: 55.7221,
            longitude: 37.62556,
          },
          {
            latitude: 55.72223,
            longitude: 37.62557,
          },
          {
            latitude: 55.72224,
            longitude: 37.62558,
          },
        ]}
      />
      <Circle
        strokeWidth={40}
        strokeColor="white"
        center={{
          latitude: 55.72324,
          longitude: 37.62358,
        }}
        radius={40}
      />
      <UrlTile shouldReplaceMapContent={true} urlTemplate={toner} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
