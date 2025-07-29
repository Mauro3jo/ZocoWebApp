import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Login.styles';
import Footer from '../components/layout/Footer';
import colors from '../constants/colors';

export default function Login() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [cuit, setCuit] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCuitChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setCuit(numericOnly.length <= 11 ? numericOnly : cuit);
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
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              style={[styles.icon, { color: colors.verdeZoco }]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton}>
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
