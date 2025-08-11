// src/components/FiltrosBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function FiltrosBar() {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Icon name="filter" size={18} color="#B4C400" />
        <Text style={styles.text}>Filtros</Text>
      </View>
      <Icon name="chevron-right" size={22} color="#30313A" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  text: { marginLeft: 8, fontSize: 15, color: '#8C91A5' },
});
