import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, {
  Circle,
  Marker,
  Polygon,
  Polyline,
  Region,
  UrlTile,
} from '@splicer97/react-native-osmdroid';

export default function App() {
  const initialRegion: Region = {
    latitude: 55.75222,
    longitude: 37.61556,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  const toner =
    'https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=j46yoHMlBMQRgTY3lCMk';
  const mapRef = React.useRef<MapView>();
  const zelenograd: Region = {
    latitude: 55.9825,
    longitude: 37.18139,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  const goHome = () => {
    mapRef.current?.animateToRegion(zelenograd);
  };
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <MapView.Animated
        ref={mapRef}
        onMapReady={async () => {
          // const mapBoundaries = await mapRef.current?.getMapBoundaries();
          // console.log(
          //   '🚀 ~ file: App.tsx:30 ~ onMapReady={ ~ mapBoundaries',
          //   mapBoundaries
          // );
        }}
        onRegionChangeComplete={async () => {
          const mapBoundaries = await mapRef.current?.getMapBoundaries();
          console.log(
            '🚀 ~ file: App.tsx:30 ~ onMapReady={ ~ mapBoundaries',
            mapBoundaries
          );
        }}
        style={styles.container}
        initialRegion={initialRegion}
      >
        <Marker
          coordinate={{
            latitude: 55.75222,
            longitude: 36.61556,
          }}
        >
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            blanditiis nobis, assumenda ipsam ex cupiditate delectus inventore
            labore autem optio eum illo adipisci exercitationem quas incidunt
            distinctio! Iure, ex quisquam!
          </Text>
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
        <UrlTile urlTemplate={toner} />
      </MapView.Animated>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          width: 400,
          height: 40,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 200,
        }}
        onPress={goHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
