import { View, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/ui/Boton';
import Footer from '../components/layout/Footer';
import styles from './Welcome.styles';
import colors from '../constants/colors';

export default function Welcome() {
  const video = useRef(null);
  const navigation = useNavigation<any>();

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

        {/* Fondo verde */}
        <View style={styles.footerSection}>
          <View style={styles.buttonWrapper}>
            <Boton text="Inicia sesión" onPress={() => navigation.navigate('Login')} />
          </View>
        </View>

        {/* Footer al fondo */}
        <View style={styles.footerAbsolute}>
          <Footer text="Condiciones de uso y política de privacidad" />
        </View>
      </View>
    </View>
  );
}
