// src/screens/Calificar.tsx
import React, { useState } from 'react';
import { View, ScrollView, LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';

import styles from './Calificar.Style';

export default function Calificar() {
  const insets = useSafeAreaInsets();

  // 👉 medimos altura real del tabbar (minHeight + safe area + padding)
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setTabbarHeight(e.nativeEvent.layout.height);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO SCROLLEABLE */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }} // 👈 adaptativo
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          {/* 🔥 contenido real de Calificar va acá */}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout} // 👈 medimos
      >
        <SafeAreaView
          edges={['bottom']}
          style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 8) }]} // respeta safe area
        >
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
