import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import styles from "./Login.styles";
import Footer from "../components/layout/Footer";
import colors from "../constants/colors";
import { API_LOGIN_URL } from "@env";
import { InicioAhorroContext } from "../src/context/InicioAhorroContext";
import { DatosInicioContext } from "../src/context/DatosInicioContext";

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

export default function Login() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // contextos
  const { fetchDatosInicioAhorro } = useContext(InicioAhorroContext) ?? {};
  const { refreshAll, setFiltrosDefault } = useContext(DatosInicioContext) ?? {};

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCuitChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, "");
    setCuit(numericOnly.length <= 11 ? numericOnly : cuit);
  };

  // 🔹 Chequear disponibilidad de biometría y preferencia guardada
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
    setPassword("");
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  // 🔹 Login normal
  const handleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const data = await loginUsuario(cuit, password);
      if (data.rol === 0) {
        const nombre = data?.usuario?.Nombre ?? data?.usuario?.nombre ?? "";

        await AsyncStorage.multiRemove(["filtrosSeleccionados", "token", "Nombre"]);
        setFiltrosDefault?.();

        await AsyncStorage.multiSet([
          ["token", data.token],
          ["Nombre", nombre],
          ["Usuario", cuit],
          ["Password", password],
        ]);

        // ✅ solo pregunta UNA vez, después de ingresar a la app
        if (biometricAvailable) {
          const askedBefore = await AsyncStorage.getItem("biometricAsked");
          if (!askedBefore) {
            await AsyncStorage.setItem("biometricAsked", "true");
            setTimeout(() => {
              Alert.alert(
                "Acceso con huella",
                "¿Querés habilitar el acceso con huella digital para futuros ingresos?",
                [
                  { text: "No", onPress: () => navigateToInicio() },
                  {
                    text: "Sí",
                    onPress: async () => {
                      await AsyncStorage.setItem("biometricEnabled", "true");
                      navigateToInicio();
                    },
                  },
                ]
              );
            }, 600);
            return;
          }
        }

        navigateToInicio();
      } else {
        setError("Este usuario no tiene permiso para ingresar.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Credenciales incorrectas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login con huella → hace login automático
  const handleBiometricLogin = async () => {
    if (!biometricEnabled) return;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Usá tu huella para ingresar",
      fallbackLabel: "Ingresar manualmente",
    });

    if (result.success) {
      const savedUser = await AsyncStorage.getItem("Usuario");
      const savedPass = await AsyncStorage.getItem("Password");
      if (savedUser && savedPass) {
        const data = await loginUsuario(savedUser, savedPass);
        if (data.rol === 0) {
          const nombre = data?.usuario?.Nombre ?? data?.usuario?.nombre ?? "";
          await AsyncStorage.multiSet([
            ["token", data.token],
            ["Nombre", nombre],
          ]);
          navigateToInicio();
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={22} style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={require("../assets/img/Logo-login.png")} style={styles.logo} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.holaContainer}>
          <Text style={styles.hola}>¡Hola!</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
        <Text style={styles.sub}>Ingresá tu CUIT para</Text>
        <Text style={styles.sub}>iniciar sesión.</Text>

        <View style={styles.inputGroup}>
          <Icon name="envelope" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="CUIT"
            value={cuit}
            onChangeText={handleCuitChange}
            keyboardType="number-pad"
            maxLength={11}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="lock" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? "eye" : "eye-slash"}
              style={[styles.icon, { color: colors.verdeZoco }]}
            />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Icon name="exclamation-circle" size={16} color="#e23d36" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* BOTÓN NORMAL */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? "Cargando datos..." : "Ingresar"}</Text>
        </TouchableOpacity>

        {/* BOTÓN SUTIL DE HUELLA */}
        {biometricAvailable && biometricEnabled && (
          <TouchableOpacity
            style={{
              marginTop: 25,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleBiometricLogin}
          >
            <Icon name="fingerprint" size={20} color={colors.verdeZoco} style={{ marginRight: 8 }} />
            <Text style={{ color: "#555", fontSize: 15 }}>Ingresar con huella</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Footer text="Condiciones de uso y Política de privacidad" />
      </View>
    </View>
  );
}
