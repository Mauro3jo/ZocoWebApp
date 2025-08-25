// src/screens/Analisis.tsx
import React, { useContext, useState } from "react";
import { View, ScrollView, LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";
import DatosAnalisisMobile from "../components/Analisis/DatosAnalisisMobile";
import EvolucionMensual3BarrasMobile from "../components/Analisis/EvolucionMensual3BarrasMobile";
import TripleGraficoAnalisisMobile from "../components/Analisis/TripleGraficoAnalisisMobile";
import { DatosInicioContext } from "../src/context/DatosInicioContext";
import styles from "./Analisis.styles";

export default function Analisis() {
  const insets = useSafeAreaInsets();
  const { datosAnalisisContext } =
    useContext(DatosInicioContext) ?? { datosAnalisisContext: null };

  // ⬇️ altura real del tabbar (se mide en runtime)
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          <DatosAnalisisMobile datosBack={datosAnalisisContext} />
          <EvolucionMensual3BarrasMobile datosBack={datosAnalisisContext} />
          <TripleGraficoAnalisisMobile datosBack={datosAnalisisContext} />
        </View>
      </ScrollView>

      {/* Tab bar fija, medimos su alto y lo aplicamos arriba */}
      <View style={styles.tabbarContainer} pointerEvents="box-none" onLayout={onTabbarLayout}>
        <SafeAreaView
          edges={["bottom"]}
          style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
