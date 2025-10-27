// App.tsx
import React, { useEffect } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import {
  useFonts,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import AppNavigation from "./app/navigation";
import { DatosInicioProvider } from "./src/context/DatosInicioContext";
import { InicioAhorroProvider } from "./src/context/InicioAhorroContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    // ✅ Configuración visual de la barra de navegación en Android
    NavigationBar.setPositionAsync("relative");
    NavigationBar.setBehaviorAsync("inset-swipe");
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  // Mientras cargan las fuentes, mostramos un loader simple
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#B1C20E" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* ✅ Barra de estado superior sin transparencia */}
      <StatusBar translucent={false} barStyle="dark-content" backgroundColor="#F4F6FA" />

      {/* ✅ SafeArea global: toda la app respeta los márgenes seguros */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
        <DatosInicioProvider>
          <InicioAhorroProvider>
            <AppNavigation />
          </InicioAhorroProvider>
        </DatosInicioProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
