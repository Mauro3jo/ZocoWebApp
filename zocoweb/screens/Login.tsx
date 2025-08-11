import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './Login.styles';
import Footer from '../components/layout/Footer';
import colors from '../constants/colors';
import { API_LOGIN_URL } from '@env';
import { InicioAhorroContext } from '../src/context/InicioAhorroContext';
import { DatosInicioContext } from '../src/context/DatosInicioContext';

type LoginResponse = {
  usuario?: { Nombre?: string; nombre?: string } | null;
  token: string;
  rol: number;
};

const loginUsuario = async (usuario: string, password: string) => {
  const body = { Usuario: usuario, Password: password };
  const response = await axios.post<LoginResponse>(
    API_LOGIN_URL,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export default function Login() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [cuit, setCuit] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // refrescos de contextos (mobile)
  const { fetchDatosInicioAhorro } = useContext(InicioAhorroContext) ?? {};
  const { refreshAll } = useContext(DatosInicioContext) ?? {};

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCuitChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setCuit(numericOnly.length <= 11 ? numericOnly : cuit);
  };

  const handleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const data = await loginUsuario(cuit, password); // { usuario, token, rol }

      if (data.rol === 0) {
        const nombre = data?.usuario?.Nombre ?? data?.usuario?.nombre ?? '';

        // Guarda SOLO token y Nombre
        await AsyncStorage.multiSet([
          ['token', data.token],
          ['Nombre', nombre],
        ]);

        // Asegura persistencia antes de cambiar de pantalla
        await AsyncStorage.getItem('token');

        // Cargar datos necesarios ANTES de salir del login
        // (aunque el usuario no tenga históricos, las llamadas terminan)
        await Promise.all([
          fetchDatosInicioAhorro?.(),
          refreshAll?.(),
        ]).catch(() => { /* evitamos romper el flujo si alguna falla */ });

        setPassword('');

        // Recién ahora navegamos
        navigation.reset({
          index: 0,
          routes: [{ name: 'Inicio' }],
        });
      } else {
        setError('Este usuario no tiene permiso para ingresar.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.mensaje ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Credenciales incorrectas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={22} style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={require('../assets/img/Logo-login.png')} style={styles.logo} />
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
              name={showPassword ? 'eye' : 'eye-slash'}
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

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? 'Cargando datos...' : 'Ingresar'}</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER con safe area */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Footer text="Condiciones de uso y Política de privacidad" />
      </View>
    </View>
  );
}
