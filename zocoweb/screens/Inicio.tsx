import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainView from '../components/MainView'; // Ajustá el path según tu estructura

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Inicio</Text>
      {/* Llamada al menú ya hecho */}
      <MainView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
