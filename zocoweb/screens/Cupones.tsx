import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import { DatosInicioContext } from "../src/context/DatosInicioContext";
import DatosTicketsMobile from "../components/Cupones/DatosTicketsMobile";
import TablaTicketsMobile from "../components/Cupones/TablaTicketsMobile";

import styles from "./Cupones.styles";

const TABBAR_HEIGHT = 64;

export default function Cupones() {
  const insets = useSafeAreaInsets();

  // 👉 consulta al contexto AQUÍ
  const { datosCuponesContext, datos } =
    useContext(DatosInicioContext) ?? { datosCuponesContext: null, datos: null };

  const listaMes = useMemo(
    () => datosCuponesContext?.listaMes ?? [],
    [datosCuponesContext?.listaMes]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeaderPrincipal />
      <FiltrosBar />

      <View style={{ flex: 1 }}>
        <TablaTicketsMobile
          listaMes={listaMes}
          datos={datos}
          headerComponent={<DatosTicketsMobile datosCuponesContext={datosCuponesContext} />}
          bottomPadding={TABBAR_HEIGHT + Math.max(insets.bottom, 8)}
        />
      </View>

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
