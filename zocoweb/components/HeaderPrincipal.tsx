import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Z from '../assets/svg/Z.svg';

export default function HeaderPrincipal() {
  const [nombre, setNombre] = useState<string>('');

  const loadNombre = useCallback(async () => {
    try {
      const n = (await AsyncStorage.getItem('Nombre')) || '';
      setNombre(n);
    } catch {
      setNombre('');
    }
  }, []);

  // Carga/recarga cuando la pantalla está enfocada
  useFocusEffect(
    useCallback(() => {
      loadNombre();
    }, [loadNombre])
  );

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Z width={20} height={20} />
        <Text style={styles.text}>Hola{nombre ? `, ${nombre}` : ''}!</Text>
      </View>
      <TouchableOpacity>
        <IconMC name="account-circle-outline" size={24} color="#b0b5c3" />
      </TouchableOpacity>
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
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  text: { marginLeft: 6, fontSize: 14, fontWeight: '500', color: '#000' },
});
