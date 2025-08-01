// src/screens/AppLoading.js
import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

// IMPORTÁ LA IMAGEN ACÁ
import Logo from '../assets/img/Logo-login.png';

export default function AppLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={Logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#B1C20E" style={styles.spinner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 20, // Ajusta el espacio entre logo y spinner
  },
  spinner: {
    marginTop: 0,
  },
});
