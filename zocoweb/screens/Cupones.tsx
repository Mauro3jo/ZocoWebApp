// src/screens/Cupones.tsx
import React, { useContext, useMemo, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import { DatosInicioContext } from "../src/context/DatosInicioContext";
import DatosTicketsMobile from "../components/Cupones/DatosTicketsMobile";
import TablaTicketsMobile from "../components/Cupones/TablaTicketsMobile";

import styles from "./Cupones.styles";

export default function Cupones() {
  const insets = useSafeAreaInsets();

  // 👉 consulta al contexto AQUÍ
  const { datosCuponesContext, datos } =
    useContext(DatosInicioContext) ?? { datosCuponesContext: null, datos: null };

  const listaMes = useMemo(
    () => datosCuponesContext?.listaMes ?? [],
    [datosCuponesContext?.listaMes]
  );

  // 🔹 altura real del tabbar
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <View style={{ flex: 1 }}>
        <TablaTicketsMobile
          listaMes={listaMes}
          datos={datos}
          headerComponent={
            <DatosTicketsMobile datosCuponesContext={datosCuponesContext} />
          }
          bottomPadding={tabbarHeight} // ✅ adaptativo
        />
      </View>

      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout} // 👈 medimos
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
