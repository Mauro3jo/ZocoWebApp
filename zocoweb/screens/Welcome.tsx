import React, { useRef } from 'react';
import { View, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ agregado
import Boton from '../components/ui/Boton';
import Footer from '../components/layout/Footer';
import styles from './Welcome.styles';
import colors from '../constants/colors';

export default function Welcome() {
  const video = useRef(null);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // ✅ Función que guarda el flag y navega al Login
  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('welcomeSeen', 'true');
      navigation.replace('Login'); // reemplaza en lugar de apilar
    } catch (error) {
      console.error('Error al guardar flag welcomeSeen:', error);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/videos/fondo.mp4')}
        style={styles.video}
        shouldPlay
        isLooping
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.textWrapper}>
          <Text style={styles.textLine1}>Te damos</Text>
          <Text style={styles.textLine2}>la Bienvenida a</Text>
          <Text style={styles.textLine3}>la app de zoco</Text>
        </View>

        <Image
          source={require('../assets/img/Z-Welcome.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Fondo verde, con safe area opcional */}
        <View style={[styles.footerSection, { paddingBottom: insets.bottom }]}>
          <View style={styles.buttonWrapper}>
            {/* 🔹 Botón que guarda y saltea el Welcome */}
            <Boton text="Inicia sesión" onPress={handleContinue} />
          </View>
        </View>

        {/* Footer al fondo, siempre visible */}
        <View style={[styles.footerAbsolute, { paddingBottom: insets.bottom }]}>
          <Footer text="Condiciones de uso y política de privacidad" />
        </View>
      </View>
    </View>
  );
}
