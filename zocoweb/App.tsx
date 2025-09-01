// App.tsx
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

import AppNavigation from "./app/navigation";
import { DatosInicioProvider } from "./src/context/DatosInicioContext";
import { InicioAhorroProvider } from "./src/context/InicioAhorroContext";

export default function App() {
  useEffect(() => {
    // ✅ Android: barra de navegación NO superpuesta
    NavigationBar.setPositionAsync("relative");     // contenido por encima de la nav bar
    NavigationBar.setBehaviorAsync("inset-swipe");  // aplica insets al mostrarse/ocultarse
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <SafeAreaProvider>
      {/* Arriba sólido; nada de transparencia */}
      <StatusBar translucent={false} barStyle="dark-content" backgroundColor="#F4F6FA" />

      {/* 👇 SafeArea global con bottom: TODA la app empieza por arriba del menú de sistema */}
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
