import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';


export default function Loader() {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1f619e" />
      </View>
    </View>
  );

};

const styles = StyleSheet.create({

  container: {
    position: 'absolute', 
    top: 0, bottom:0, right:0, left:0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
