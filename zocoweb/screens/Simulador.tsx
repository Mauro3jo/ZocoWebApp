import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';

import styles from './Simulador.styles';

const TABBAR_HEIGHT = 64;

export default function Simulador() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO SCROLLEABLE */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom: TABBAR_HEIGHT + insets.bottom + 20, // 🔥 espacio dinámico
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔥 Contenido de Simulador */}
        <View style={{ padding: 20 }}>
          {/* Placeholder temporal */}
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
