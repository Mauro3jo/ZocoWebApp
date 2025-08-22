// src/screens/Analisis.tsx
import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import DatosAnalisisMobile from "../components/Analisis/DatosAnalisisMobile";
import EvolucionMensual3BarrasMobile from "../components/Analisis/EvolucionMensual3BarrasMobile";
import TripleGraficoAnalisisMobile from "../components/Analisis/TripleGraficoAnalisisMobile"; // 👈 agregado

import { DatosInicioContext } from "../src/context/DatosInicioContext";
import styles from "./Analisis.styles";

const TABBAR_HEIGHT = 64;

export default function Analisis() {
  const insets = useSafeAreaInsets();

  const { datosAnalisisContext } =
    useContext(DatosInicioContext) ?? { datosAnalisisContext: null };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          <DatosAnalisisMobile datosBack={datosAnalisisContext} />

          {/* Evolución mensual */}
          <EvolucionMensual3BarrasMobile datosBack={datosAnalisisContext} />

          {/* Triple gráfico (ventas por tipo de pago, ticket promedio, cuotas) */}
          <TripleGraficoAnalisisMobile datosBack={datosAnalisisContext} />
        </View>
      </ScrollView>

      <View style={styles.tabbarContainer}>
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
