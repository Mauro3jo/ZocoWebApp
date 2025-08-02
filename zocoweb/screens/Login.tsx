import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './Login.styles';
import Footer from '../components/layout/Footer';
import colors from '../constants/colors';
import { API_LOGIN_URL } from '@env'; // ESTA ES LA FORMA QUE PIDE EXPO

const loginUsuario = async (usuario: string, password: string) => {
  const body = {
    Usuario: usuario,
    Password: password,
  };

  const response = await axios.post(
    API_LOGIN_URL, // <-- ACA USA LA VARIABLE DEL .ENV
    body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export default function Login() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [cuit, setCuit] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCuitChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setCuit(numericOnly.length <= 11 ? numericOnly : cuit);
  };

  const handleLogin = async () => {
    setError(null);
    try {
      const data = await loginUsuario(cuit, password);

      if (data.rol === 0) {
        await AsyncStorage.setItem('token', data.token);
        navigation.replace('Inicio');
      } else {
        setError('Este usuario no tiene permiso para ingresar.');
      }
    } catch (error: any) {
      if (error?.response?.data) {
        setError(
          error.response.data.message ||
            error.response.data.error ||
            'Credenciales incorrectas'
        );
      } else {
        setError('No se pudo iniciar sesión. Verifica tus datos e intenta nuevamente.');
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Ingresar</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Footer text="Condiciones de uso y Política de privacidad" />
      </View>
    </View>
  );
}
