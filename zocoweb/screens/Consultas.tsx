import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";
import ContenidoConsultasAliados from "../components/Consultas/ContenidoConsultasAliados";

import styles from "./Consultas.styles";

export default function Consultas() {
  const insets = useSafeAreaInsets();

  // medimos altura real del tabbar (minHeight + safe area + padding)
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setTabbarHeight(e.nativeEvent.layout.height);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER + FILTROS (fijos) */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* CONTENIDO (sin ScrollView; el FlatList interno maneja el scroll) */}
      <View style={[styles.scroll, { paddingHorizontal: 20 }]}>
        <ContenidoConsultasAliados contentBottomPadding={tabbarHeight} />
      </View>

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
