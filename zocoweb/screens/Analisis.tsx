import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import DatosAnalisisMobile from "../components/Analisis/DatosAnalisisMobile";
// (luego agregamos)
// import EvolucionMensual3BarrasMobile from "../components/Analisis/EvolucionMensual3BarrasMobile";
// import TripleGraficoAnalisisMobile from "../components/Analisis/TripleGraficoAnalisisMobile";

import { DatosInicioContext } from "../src/context/DatosInicioContext";
import styles from "./Analisis.styles";

const TABBAR_HEIGHT = 64;

export default function Analisis() {
  const insets = useSafeAreaInsets();

  // 🔹 consumir datos desde el contexto (mismos nombres que en web)
  const { datosAnalisisContext } =
    useContext(DatosInicioContext) ?? { datosAnalisisContext: null };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          {/* Datos principales (equivalente a DatosAnalisis en web) */}
          <DatosAnalisisMobile datosBack={datosAnalisisContext} />

          {/* 🔜 Próximos: gráficas mobile */}
          {/* <EvolucionMensual3BarrasMobile datosBack={datosAnalisisContext} /> */}
          {/* <TripleGraficoAnalisisMobile datosBack={datosAnalisisContext} /> */}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
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
