import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_API_NOTIFICACIONES } from "@env";

import HeaderPrincipal from "../components/HeaderPrincipal";
import FiltrosBar from "../components/FiltrosBar";
import MainView from "../components/MainView";

import styles from "./Notificaciones.styles";

type Noticia = {
  id: number;
  noticia1: string;
  fecha: string;
  tipoUsuario?: string;
};

export default function Notificaciones() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabbarHeight, setTabbarHeight] = useState(0);

  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return fechaISO;
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const cargarNoticias = async () => {
    try {
      setLoading(true);
      const response = await fetch(REACT_APP_API_NOTIFICACIONES);
      if (!response.ok) throw new Error("Error al obtener notificaciones");

      const data = await response.json();
      const noticiasAliados = data.filter(
        (n: Noticia) =>
          n.tipoUsuario && n.tipoUsuario.trim().toLowerCase() === "aliado"
      );
      setNoticias(noticiasAliados);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* HEADER Y FILTROS */}
      <HeaderPrincipal />
      <FiltrosBar />

      {/* FLECHA Y TÍTULO */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabbarHeight }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#B4C400" />
            <Text style={styles.loadingText}>Cargando noticias...</Text>
          </View>
        ) : noticias.length === 0 ? (
          <Text style={styles.empty}>No hay notificaciones disponibles.</Text>
        ) : (
          noticias.map((n, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.descripcion}>{n.noticia1}</Text>
              <Text style={styles.fecha}>{formatearFecha(n.fecha)}</Text>
              {index < noticias.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))
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
