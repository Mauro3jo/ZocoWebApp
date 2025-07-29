import { View, Text, StyleSheet, Image } from 'react-native';
import { Video } from 'expo-av';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/ui/Boton';
import colors from '../constants/colors';

export default function Welcome() {
  const video = useRef(null);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/videos/fondo.mp4')}
        style={StyleSheet.absoluteFill}
        shouldPlay
        isLooping
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Text style={styles.textTop}>Te damos la bienvenida a</Text>
        <Text style={styles.textBold}>la app de zoco</Text>

        {/* Imagen de la Z */}
        <Image
          source={require('../assets/img/Z-Welcome.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Footer con botón */}
        <View style={styles.footer}>
          <Boton text="Inicia sesión" onPress={() => navigation.navigate('Login')} />
          <Text style={styles.legal}>Condiciones de uso y política de privacidad</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textTop: {
    position: 'absolute',
    top: 100,
    left: 30,
    fontSize: 18,
    color: colors.blanco,
    fontWeight: '300',
  },
  textBold: {
    position: 'absolute',
    top: 125,
    left: 30,
    fontSize: 24,
    color: colors.blanco,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: colors.verdeZoco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
    paddingHorizontal: 30,
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  legal: {
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
});
