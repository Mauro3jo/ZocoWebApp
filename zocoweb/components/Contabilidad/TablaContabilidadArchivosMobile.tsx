import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TablaContabilidadArchivosMobile({ datos }) {
  const archivos = datos?.archivos ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Comprobantes</Text>
      {archivos.length > 0 ? (
        archivos.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.monto}>${item.monto}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.vacio}>No hay comprobantes</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#30313A',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  nombre: {
    fontSize: 14,
    color: '#555',
  },
  monto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30313A',
  },
  vacio: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
