import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';

import styles from './Contabilidad.styles';

const TABBAR_HEIGHT = 64;

export default function Contabilidad() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO SCROLLEABLE */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔥 acá va todo tu contenido de contabilidad */}
        <View style={{ padding: 20 }}>
          {/* Ejemplo placeholder */}
          {/* Reemplazá por tus componentes reales */}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <View style={styles.tabbarContainer}>
        <SafeAreaView edges={['bottom']} style={styles.tabbar}>
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
