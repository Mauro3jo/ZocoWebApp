import React, { useRef, useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Video } from "expo-av";
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

  useEffect(() => {
    const checkBiometric = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const enabled = await AsyncStorage.getItem("biometricEnabled");
      setBiometricAvailable(compatible && enrolled);
      setBiometricEnabled(enabled === "true");
    };
    checkBiometric();
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
    if (!biometricEnabled || loading) return;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Usá tu huella para ingresar",
      fallbackLabel: "Ingresar manualmente",
    });

    if (!result.success) return;

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

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require("../assets/videos/fondo.mp4")}
        style={styles.video}
        shouldPlay
        isLooping
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        {/* Z superior izquierda */}
        <View style={styles.logoZ}>
          <ZIcon width={45} height={45} />
        </View>

        {/* Texto principal */}
        <View style={styles.textWrapper}>
          <Text style={styles.textLine1}>Bienvenido</Text>
          <Text style={styles.textLine2}>a la app de</Text>
          <Text style={styles.textLine3}>ZOCO</Text>
        </View>

        {/* Área verde con botón y huella */}
        <View style={[styles.footerSection, { paddingBottom: insets.bottom + 90 }]}>
          <View style={styles.buttonWrapper}>
            <Boton text="Inicia sesión" onPress={handleContinue} />
          </View>

          {biometricAvailable && biometricEnabled && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              activeOpacity={0.8}
              style={styles.huellaButton}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Huella width={58} height={58} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Footer fijo al final */}
        <View style={[styles.footerWrapper, { paddingBottom: insets.bottom }]}>
          <Footer text="Condiciones de uso y política de privacidad" />
        </View>
      </View>
    </View>
  );
}
