// src/screens/Contabilidad.tsx
import React, { useContext, useState } from "react";
import { View, ScrollView, LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import DatosContabilidadMobile from "../components/Contabilidad/DatosContabilidadMobile";
import ImpuestosCardsMobile from "../components/Contabilidad/ImpuestosCardsMobile";
import TablaContabilidadArchivosMobile from "../components/Contabilidad/TablaContabilidadArchivosMobile";

import { DatosInicioContext } from "../src/context/DatosInicioContext";

import styles from "./Contabilidad.styles";

export default function Contabilidad() {
  const insets = useSafeAreaInsets();

  // 🔹 datos desde el contexto
  const { datosContabilidadContext } =
    useContext(DatosInicioContext) ?? { datosContabilidadContext: null };

  // 🔹 medir altura real del tabbar para el padding del ScrollView
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }} // ✅ adaptativo
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 SIEMPRE mostrar todo (como en web) */}
        <DatosContabilidadMobile datosBack={datosContabilidadContext} />

        <ImpuestosCardsMobile datosBack={datosContabilidadContext} />

        <TablaContabilidadArchivosMobile
          datosBack={datosContabilidadContext?.archivos}
        />
      </ScrollView>

      {/* Menú fijo abajo */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout} // 👈 medimos altura
      >
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
