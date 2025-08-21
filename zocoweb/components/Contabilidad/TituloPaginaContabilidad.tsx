import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TituloPaginaContabilidad() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Contabilidad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30313A',
  },
});
