import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';

const Geofence = () => {
  const markers = [
    { title: 'Marker 1', coordinate: { latitude: 37.78825, longitude: -122.4324 } },
    // Add more markers as needed
  ];

  const polygonCoords = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.7943, longitude: -122.4324 },
    { latitude: 37.7943, longitude: -122.4076 },
    // Add more coordinates to define the polygon
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title} />
        ))}
        <Polygon coordinates={polygonCoords} fillColor="rgba(255, 0, 0, 0.5)" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Geofence;
