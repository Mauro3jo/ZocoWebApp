import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./Login.styles";
import Footer from "../components/layout/Footer";
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

  const { fetchDatosInicioAhorro } = useContext(InicioAhorroContext) ?? {};
  const { refreshAll, setModoLogin } = useContext(DatosInicioContext) ?? {};

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCuitChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, "");
    setCuit(numericOnly.length <= 11 ? numericOnly : cuit);
  };

  const navigateToInicio = () => {
    setPassword("");
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  const handleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const data = await loginUsuario(cuit, password);

      if (data.rol === 0) {
        const nombre = data?.usuario?.Nombre ?? data?.usuario?.nombre ?? "";

        await AsyncStorage.multiRemove([
          "filtrosSeleccionados",
          "token",
          "Nombre",
          "Usuario",
          "Password",
        ]);

        await AsyncStorage.multiSet([
          ["token", data.token],
          ["Nombre", nombre],
          ["Usuario", cuit],
          ["Password", password],
        ]);

        setModoLogin?.(true);
        const ok = await refreshAll?.(true);

        if (ok) {
          await fetchDatosInicioAhorro?.();
          navigateToInicio();
        } else {
          setError("Error cargando los datos iniciales. Intente nuevamente.");
        }
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

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.replace("Welcome")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={22} style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={require("../assets/img/Logo-login.png")} style={styles.logo} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.holaContainer}>
          <Text style={styles.hola}>¡Hola!</Text>
          <Image source={require("../assets/img/hola.png")} style={styles.holaImg} />
        </View>

        <Text style={styles.sub}>Ingresá tu CUIT para iniciar sesión.</Text>

        {/* CUIT */}
        <View style={styles.inputGroup}>
          <Image source={require("../assets/img/usuario.png")} style={styles.iconImg} />
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

        {/* CONTRASEÑA */}
        <View style={styles.inputGroup}>
          <Image source={require("../assets/img/candado.png")} style={styles.iconImg} />
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
              style={[styles.icon, { color: "#000" }]}
            />
          </TouchableOpacity>
        </View>

        {/* ERRORES */}
        {error && (
          <View style={styles.errorBox}>
            <Icon name="exclamation-circle" size={16} color="#e23d36" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* BOTÓN LOGIN */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Footer text="Condiciones de uso y Política de privacidad" />
      </View>
    </View>
  );
}
