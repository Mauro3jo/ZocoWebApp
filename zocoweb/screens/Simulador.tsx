import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
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
  const [modo, setModo] = useState<"plazo" | "monto">("plazo");

  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 Encabezado del simulador */}
        <View style={styles.toggleContainer}>
          <Text style={styles.title}>Simulador</Text>

          <View style={styles.toggleButtonsRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                modo === "plazo" ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={() => setModo("plazo")}
            >
              <Text
                style={
                  modo === "plazo"
                    ? styles.toggleTextActive
                    : styles.toggleTextInactive
                }
              >
                Plazos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                modo === "monto" ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={() => setModo("monto")}
            >
              <Text
                style={
                  modo === "monto"
                    ? styles.toggleTextActive
                    : styles.toggleTextInactive
                }
              >
                Monto
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔹 Render dinámico */}
        {modo === "plazo" ? (
          <>
            <CalculadoraPlazosMobile />
        {/*     <PaymentTableMobile /> */}
          </>
        ) : (
          <CalculadoraNuevaMobile />
        )}
      </ScrollView>

      {/* 🔹 MENÚ INFERIOR */}
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
