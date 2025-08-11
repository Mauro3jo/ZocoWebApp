// src/screens/Inicio.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';

export default function Inicio() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <HeaderPrincipal />
      <FiltrosBar />
      <View style={{ flex: 1, marginTop: 12 }}>
        <MainView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
});
