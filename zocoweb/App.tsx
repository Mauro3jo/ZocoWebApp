// App.tsx
import React, { useEffect } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

// 🔥 IMPORTACIÓN COMPLETA DE MONTSERRAT (CON SEMIBOLD)
import {
  useFonts,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import AppNavigation from "./app/navigation";
import { DatosInicioProvider } from "./src/context/DatosInicioContext";
import { InicioAhorroProvider } from "./src/context/InicioAhorroContext";

// 🔔 Notificaciones inteligentes
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { ejecutarNotificacionesZoco } from "./src/services/notificacionesInteligentes";
import { useNavigationContainerRef } from "@react-navigation/native";

// 🔧 Background Fetch y Task Manager
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "ZocoBackgroundNotifications";

// 📌 Tarea background
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("🔔 Ejecutando tarea de fondo de Zoco...");
    await ejecutarNotificacionesZoco();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.warn("❌ Error en tarea background:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function iniciarBackgroundFetch() {
  try {
    const status = await BackgroundFetch.getStatusAsync();

    if (
      status === BackgroundFetch.Status.Restricted ||
      status === BackgroundFetch.Status.Denied
    ) {
      console.log("⚠️ Background fetch no permitido por el sistema.");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 5 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("✅ Background fetch de Zoco registrado correctamente.");
    } else {
      console.log("ℹ️ Background fetch ya estaba registrado.");
    }
  } catch (err) {
    console.warn("❌ Error registrando background fetch:", err);
  }
}

export default function App() {
  // 🔥 AHORA SÍ: CARGA TODAS LAS FUENTES NECESARIAS
  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_600SemiBold, // ← ESTA ES LA CLAVE
    Montserrat_700Bold,
  });

  const navigationRef = useNavigationContainerRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    NavigationBar.setPositionAsync("relative");
    NavigationBar.setBehaviorAsync("inset-swipe");
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");

    const configurarPermisos = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log("Permisos de notificación denegados");
          return;
        }
      }
    };

    configurarPermisos();

    const listener = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Notificaciones");
      }
    });

    ejecutarNotificacionesZoco();

    const intervalo = setInterval(async () => {
      await ejecutarNotificacionesZoco();
    }, 5 * 60 * 1000);

    iniciarBackgroundFetch();

    return () => {
      clearInterval(intervalo);
      listener.remove();
    };
  }, []);

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
      <StatusBar translucent={false} barStyle="dark-content" backgroundColor="#F4F6FA" />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
        <DatosInicioProvider>
          <InicioAhorroProvider>
            <AppNavigation ref={navigationRef} />
          </InicioAhorroProvider>
        </DatosInicioProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
