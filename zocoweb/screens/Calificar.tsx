import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  LayoutChangeEvent,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";
import FormComentarioCalificarMobile from "../components/Calificar/FormComentarioCalificarMobile";

import styles from "./Calificar.Style";
import { REACT_APP_API_TOKEN } from "@env";

export default function Calificar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          manejarNoAutorizado();
          return;
        }

        const resp = await fetch(REACT_APP_API_TOKEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!resp.ok) {
          if (resp.status === 401) manejarNoAutorizado();
          return;
        }

        const data = await resp.json();
        if (data !== 0) manejarAccesoDenegado();
      } catch {
        manejarNoAutorizado();
      }
    };

    const manejarNoAutorizado = () => {
      AsyncStorage.removeItem("token");
      Alert.alert(
        "Sesión expirada o token inválido",
        "Iniciá sesión nuevamente.",
        [{ text: "OK", onPress: () => navigation.replace("Inicio") }]
      );
    };

    const manejarAccesoDenegado = () => {
      Alert.alert("Acceso denegado", "No tenés permisos para acceder.", [
        { text: "OK", onPress: () => navigation.replace("Inicio") },
      ]);
    };

    verificarToken();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER + FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* BLOQUE BLANCO CON FORMULARIO */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#FFFFFF",
          paddingBottom: tabbarHeight,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🔹 separador gris para mantener el contraste visual */}
        <View style={styles.separatorTop} />

        {/* 🔸 contenido principal blanco */}
        <View style={{ padding: 20, backgroundColor: "#FFFFFF" }}>
          <FormComentarioCalificarMobile />
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout}
      >
        <SafeAreaView
          edges={["bottom"]}
          style={[
            styles.tabbar,
            {
              paddingBottom: Math.max(
                insets.bottom,
                Platform.OS === "ios" ? 8 : 10
              ),
            },
          ]}
        >
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
