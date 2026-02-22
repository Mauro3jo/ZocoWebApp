import React, { useRef, useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ZIcon from "../assets/svg/Z-icon.svg";
import Huella from "../assets/svg/huella-dactilar 1.svg";
import Boton from "../components/ui/Boton";
import Footer from "../components/layout/Footer";
import styles from "./Welcome.styles";
import { API_LOGIN_URL } from "@env";
import { DatosInicioContext } from "../src/context/DatosInicioContext";
import { InicioAhorroContext } from "../src/context/InicioAhorroContext";

type LoginResponse = {
  usuario?: { Nombre?: string; nombre?: string } | null;
  token: string;
  rol: number;
};

const loginUsuario = async (usuario: string, password: string) => {
  const body = { Usuario: usuario, Password: password };
  const response = await axios.post<LoginResponse>(API_LOGIN_URL, body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default function Welcome() {
  const video = useRef(null);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { refreshAll, setModoLogin } = useContext(DatosInicioContext) ?? {};
  const { fetchDatosInicioAhorro } = useContext(InicioAhorroContext) ?? {};

  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);

  const checkBiometricState = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const enabled = await AsyncStorage.getItem("biometricEnabled");
      const [[, savedUser], [, savedPass]] = await AsyncStorage.multiGet([
        "Usuario",
        "Password",
      ]);

      setBiometricAvailable(compatible && enrolled);
      setBiometricEnabled(enabled === "true");
      setHasSavedCredentials(Boolean(savedUser && savedPass));
    } catch {
      setBiometricAvailable(false);
      setBiometricEnabled(false);
      setHasSavedCredentials(false);
    }
  };

  useEffect(() => {
    checkBiometricState();
  }, []);

  const navigateToInicio = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  const handleContinue = () => {
    navigation.replace("Login");
  };

  const handleBiometricLogin = async () => {
    if (loading) return;

    if (!hasSavedCredentials) {
      Alert.alert("Atención", "Primero iniciá sesión manualmente para guardar tus datos.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: biometricEnabled
        ? "Usá tu huella para ingresar"
        : "Confirmá para activar ingreso biométrico",
      fallbackLabel: "Ingresar manualmente",
    });

    if (!result.success) return;

    if (!biometricEnabled) {
      await AsyncStorage.setItem("biometricEnabled", "true");
      setBiometricEnabled(true);
    }

    try {
      setLoading(true);
      const savedUser = await AsyncStorage.getItem("Usuario");
      const savedPass = await AsyncStorage.getItem("Password");

      if (!savedUser || !savedPass) {
        Alert.alert("Atención", "No hay credenciales guardadas. Iniciá sesión manualmente.");
        return;
      }

      const data = await loginUsuario(savedUser, savedPass);

      if (data.rol === 0) {
        const nombre = data?.usuario?.Nombre ?? data?.usuario?.nombre ?? "";
        await AsyncStorage.multiSet([
          ["token", data.token],
          ["Nombre", nombre],
        ]);

        setModoLogin?.(true);
        const ok = await refreshAll?.(true);
        if (ok) {
          await fetchDatosInicioAhorro?.();
          navigateToInicio();
        } else {
          Alert.alert("Error", "No se pudieron cargar los datos iniciales.");
        }
      } else {
        Alert.alert("Acceso denegado", "Este usuario no tiene permiso para ingresar.");
      }
    } catch {
      Alert.alert("Error", "No se pudo iniciar sesión con huella.");
    } finally {
      setLoading(false);
    }
  };

  const player = useVideoPlayer(require("../assets/videos/fondo.mp4"), (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        pointerEvents="none"
        contentFit="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.logoZ}>
          <ZIcon width={45} height={45} />
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.textLine1}>Bienvenido</Text>
          <Text style={styles.textLine2}>a la app de</Text>
          <Text style={styles.textLine3}>ZOCO</Text>
        </View>

        <View style={[styles.footerSection, { paddingBottom: insets.bottom + 90 }]}>
          <View style={styles.buttonWrapper}>
            <Boton text="Inicia sesión" onPress={handleContinue} />
          </View>

          {biometricAvailable && hasSavedCredentials && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              activeOpacity={0.8}
              style={[styles.huellaButton, !biometricEnabled && { opacity: 0.95 }]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Huella width={58} height={58} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.footerWrapper, { paddingBottom: insets.bottom }]}>
          <Footer text="Condiciones de uso y política de privacidad" />
        </View>
      </View>
    </View>
  );
}