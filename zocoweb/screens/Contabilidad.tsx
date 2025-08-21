import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import DatosContabilidadMobile from "../components/Contabilidad/DatosContabilidadMobile";
import ImpuestosCardsMobile from "../components/Contabilidad/ImpuestosCardsMobile";
import TablaContabilidadArchivosMobile from "../components/Contabilidad/TablaContabilidadArchivosMobile";

import { DatosInicioContext } from "../src/context/DatosInicioContext";

import styles from "./Contabilidad.styles";

const TABBAR_HEIGHT = 64;

export default function Contabilidad() {
  const insets = useSafeAreaInsets();

  // 🔹 consumir datos desde el contexto
  const { datosContabilidadContext } =
    useContext(DatosInicioContext) ?? { datosContabilidadContext: null };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 SIEMPRE mostrar todo (como en la versión web) */}
        <DatosContabilidadMobile datosBack={datosContabilidadContext} />

        <ImpuestosCardsMobile datosBack={datosContabilidadContext} />

        <TablaContabilidadArchivosMobile
          datosBack={datosContabilidadContext?.archivos}
        />
      </ScrollView>

      {/* Menú fijo abajo */}
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
