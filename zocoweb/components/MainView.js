import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 🟩 Íconos SVG con fill="currentColor"
import HomeIcon from '../assets/svg/casa 1.svg';
import MenuIcon from '../assets/svg/menu-2 1.svg';
import CampanaIcon from '../assets/svg/notificacion 1.svg';

const { width } = Dimensions.get('window');
const SIDE_MARGIN = width * 0.10;

const COLOR_VERDE = '#B1C20E';
const COLOR_NEGRO = '#2E3136';

export default function MainView() {
  const navigation = useNavigation();
  const route = useRoute();

  // Nombre de la pantalla actual
  const currentRoute = route?.name || '';

  const handleTabPress = (tab) => {
    if (tab === 'home') navigation.navigate('Inicio');
    else if (tab === 'menu') navigation.navigate('MenuPrincipal');
    else console.log('Ir a Notificaciones');
  };

  // Colores dinámicos corregidos
  const colorHome =
    currentRoute === 'Inicio'
      ? COLOR_VERDE
      : COLOR_NEGRO;

  const colorMenu =
    currentRoute === 'MenuPrincipal'
      ? COLOR_VERDE
      : COLOR_NEGRO;

  const colorCampana = COLOR_NEGRO;

  return (
    <View style={styles.menuContainer}>
      {/* 🔔 Notificaciones */}
      <TouchableOpacity onPress={() => handleTabPress('notifications')} style={styles.tabButton}>
        <CampanaIcon width={28} height={28} color={colorCampana} />
      </TouchableOpacity>

      {/* 🏠 Home */}
      <TouchableOpacity onPress={() => handleTabPress('home')} style={styles.tabButton}>
        <HomeIcon width={28} height={28} color={colorHome} />
      </TouchableOpacity>

      {/* 📋 Menú */}
      <TouchableOpacity onPress={() => handleTabPress('menu')} style={styles.tabButton}>
        <MenuIcon width={28} height={28} color={colorMenu} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
    paddingHorizontal: SIDE_MARGIN,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
