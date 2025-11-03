import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_NOTIFICACIONES } from "@env";

// Íconos SVG
import HomeIcon from "../assets/svg/casa 1.svg";
import MenuIcon from "../assets/svg/menu-2 1.svg";
import CampanaIcon from "../assets/svg/notificacion 1.svg";

const { width } = Dimensions.get("window");
const SIDE_MARGIN = width * 0.1;

const COLOR_VERDE = "#B1C20E";
const COLOR_NEGRO = "#2E3136";

export default function MainView() {
  const navigation = useNavigation();
  const route = useRoute();
  const [tieneNuevas, setTieneNuevas] = useState(false);

  const currentRoute = route?.name || "";

  // 🔹 Verificar si hay notificaciones nuevas de tipo Aliado (sin usar token)
  const verificarNotificaciones = async () => {
    try {
      const visto = await AsyncStorage.getItem("notificaciones_vistas");
      if (visto === "true") return; // si ya se marcaron, no mostrar

      const response = await fetch(REACT_APP_API_NOTIFICACIONES);
      if (!response.ok) throw new Error("Error al obtener notificaciones");

      const data = await response.json();
      if (!data || data.length === 0) return;

      // 🔹 Filtrar solo "Aliado"
      const noticiasAliados = data.filter(
        (n) =>
          n.tipoUsuario &&
          n.tipoUsuario.trim().toLowerCase() === "aliado"
      );

      // 🔹 Verificar si hay alguna con fecha de hoy
      const hoy = new Date().toISOString().split("T")[0];
      const nuevas = noticiasAliados.some((n) => {
        const fecha = new Date(n.fecha).toISOString().split("T")[0];
        return fecha === hoy;
      });

      setTieneNuevas(nuevas);
    } catch (error) {
      console.error("Error al verificar notificaciones:", error);
    }
  };

  // 🔹 Al entrar a Notificaciones se marcan como vistas
  const marcarComoVistas = async () => {
    setTieneNuevas(false);
    await AsyncStorage.setItem("notificaciones_vistas", "true");
  };

  useEffect(() => {
    verificarNotificaciones();
  }, []);

  // 🔹 Navegación
  const handleTabPress = (tab: string) => {
    if (tab === "home") navigation.navigate("Inicio");
    else if (tab === "menu") navigation.navigate("MenuPrincipal");
    else if (tab === "notifications") {
      navigation.navigate("Notificaciones");
      marcarComoVistas();
    }
  };

  // 🔹 Colores dinámicos
  const colorHome = currentRoute === "Inicio" ? COLOR_VERDE : COLOR_NEGRO;
  const colorMenu = currentRoute === "MenuPrincipal" ? COLOR_VERDE : COLOR_NEGRO;
  const colorCampana = currentRoute === "Notificaciones" ? COLOR_VERDE : COLOR_NEGRO;

  return (
    <View style={styles.menuContainer}>
      {/* 🔔 Notificaciones */}
      <TouchableOpacity
        onPress={() => handleTabPress("notifications")}
        style={styles.tabButton}
      >
        <View>
          <CampanaIcon width={28} height={28} color={colorCampana} />
          {tieneNuevas && <View style={styles.badge} />}
        </View>
      </TouchableOpacity>

      {/* 🏠 Home */}
      <TouchableOpacity
        onPress={() => handleTabPress("home")}
        style={styles.tabButton}
      >
        <HomeIcon width={28} height={28} color={colorHome} />
      </TouchableOpacity>

      {/* 📋 Menú */}
      <TouchableOpacity
        onPress={() => handleTabPress("menu")}
        style={styles.tabButton}
      >
        <MenuIcon width={28} height={28} color={colorMenu} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    position: "absolute",
    bottom: 0,
    zIndex: 999,
    paddingHorizontal: SIDE_MARGIN,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E53935", // 🔴 rojo indicador
  },
});
