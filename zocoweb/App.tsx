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

// 🔔 Nuevas importaciones para notificaciones inteligentes
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { ejecutarNotificacionesZoco } from "./src/services/notificacionesInteligentes";
import { useNavigationContainerRef } from "@react-navigation/native";

// 🔧 Background Fetch y Task Manager
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "ZocoBackgroundNotifications";

// 🔧 Definimos la tarea que se ejecuta en segundo plano
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

    // Verificamos si ya está registrada
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 5 * 60, // cada 5 minutos
        stopOnTerminate: false, // ✅ sigue si la app se cierra
        startOnBoot: true, // ✅ se activa al reiniciar el teléfono
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
  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const navigationRef = useNavigationContainerRef();

  // Configuración del comportamiento global de las notificaciones
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    // ✅ Config visual barra navegación Android
    NavigationBar.setPositionAsync("relative");
    NavigationBar.setBehaviorAsync("inset-swipe");
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");

    // ✅ Pedir permisos de notificaciones
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

    // ✅ Listener: al tocar una notificación → abre la vista Notificaciones
    const listener = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Notificaciones");
      }
    });

    // ✅ Llamada inicial a las notificaciones
    ejecutarNotificacionesZoco();

    // ✅ Intervalo mientras la app está abierta/minimizada
    const intervalo = setInterval(async () => {
      await ejecutarNotificacionesZoco();
    }, 5 * 60 * 1000); // cada 5 min

    // ✅ Activar background fetch
    iniciarBackgroundFetch();

    return () => {
      clearInterval(intervalo);
      listener.remove();
    };
  }, []);

  // Loader mientras cargan las fuentes
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
      {/* ✅ Barra de estado superior */}
      <StatusBar translucent={false} barStyle="dark-content" backgroundColor="#F4F6FA" />

      {/* ✅ SafeArea global */}
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
