// src/screens/MainView.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import HomeIcon from '../assets/svg/Home.svg';
import CampanaIcon from '../assets/svg/Campana.svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function MainView({ navigation }) {
  const handleTabPress = (tab) => {
    if (tab === 'home') {
      // navigation.navigate('Home');
      console.log('Ir a Inicio');
    } else if (tab === 'notifications') {
      // navigation.navigate('Notifications');
      console.log('Ir a Notificaciones');
    } else if (tab === 'menu') {
      console.log('Abrir menú');
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenido principal */}
      <View style={styles.bodyContent}>
        <Text style={styles.title}>Contenido principal de la vista</Text>
      </View>
      {/* Menú inferior */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => handleTabPress('home')} style={styles.tabButton}>
          <HomeIcon width={34} height={34} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('notifications')} style={styles.tabButton}>
          <CampanaIcon width={34} height={34} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('menu')} style={styles.tabButton}>
          <Icon name="menu" size={34} color="#b0b5c3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',          // Ocupa todo el ancho disponible
    alignSelf: 'stretch',   // Asegura que el contenedor se estire
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80, // Para que no tape el menú si usás scroll
  },
  title: {
    fontSize: 22,
    color: '#2c2c2c',
    fontWeight: '600',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    width: width,                 // Usa el ancho total del dispositivo
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
