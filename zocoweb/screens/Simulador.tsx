import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import CalculadoraPlazosMobile from "../components/Simulador/CalculadoraPlazosMobile";
import CalculadoraNuevaMobile from "../components/Simulador/CalculadoraNuevaMobile";
import PaymentTableMobile from "../components/Simulador/PaymentTableMobile";

import styles from "./Simulador.styles";

export default function Simulador() {
  const insets = useSafeAreaInsets();
  const [tabbarHeight, setTabbarHeight] = useState(0);

  // toggle entre Plazos y Monto
  const [modo, setModo] = useState<"plazo" | "monto">("plazo");

  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, modo === "plazo" ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => setModo("plazo")}
          >
            <Text style={styles.toggleText}>Sim. Plazos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, modo === "monto" ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => setModo("monto")}
          >
            <Text style={styles.toggleText}>Sim. Monto</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Render dinámico */}
        {modo === "plazo" ? (
          <>
            <CalculadoraPlazosMobile />
            <PaymentTableMobile />
          </>
        ) : (
          <CalculadoraNuevaMobile />
        )}
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout}
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
