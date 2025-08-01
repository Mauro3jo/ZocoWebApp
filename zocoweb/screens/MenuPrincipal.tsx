import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import styles from './MenuPrincipal.styles';
import MainView from '../components/MainView';

const icons = {
  inicio: require('../assets/img/InicioMenu.png'),
  contabilidad: require('../assets/img/ContabilidadInicio.png'),
  cupones: require('../assets/img/CuponesInicio.png'),
  calificar: require('../assets/img/CalificarMenu.png'),
  consultas: require('../assets/img/ConsultasMenu.png'),
  simulador: require('../assets/img/SimuladorMenu.png'),
  postventa: require('../assets/img/PosventaMenu.png'),
  salir: require('../assets/img/SalirMenu.png'),
};
const logo = require('../assets/img/Logo-login.png');

const menuItems = [
  { key: 'inicio', icon: <Image source={icons.inicio} style={styles.menuIcon} />, label: 'Inicio' },
  { key: 'contabilidad', icon: <Image source={icons.contabilidad} style={styles.menuIcon} />, label: 'Contabilidad' },
  { key: 'analisis', icon: <IconMC name="magnify" size={28} color="#B1C20E" />, label: 'Análisis' },
  { key: 'cupones', icon: <Image source={icons.cupones} style={styles.menuIcon} />, label: 'Cupones' },
  { key: 'calificar', icon: <Image source={icons.calificar} style={styles.menuIcon} />, label: 'Calificar' },
  { key: 'consultas', icon: <Image source={icons.consultas} style={styles.menuIcon} />, label: 'Consultas' },
  { key: 'simulador', icon: <Image source={icons.simulador} style={styles.menuIcon} />, label: 'Simulador' },
  { key: 'postventa', icon: <Image source={icons.postventa} style={styles.menuIcon} />, label: 'Postventa' },
];

export default function MenuPrincipal({ navigation }) {
  const handleNavigation = (key) => {
    console.log('Navegar a', key);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerSpacer} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.headerIcons}>
          <IconMC name="moon-waning-crescent" size={28} color="#b0b5c3" style={styles.headerIcon} />
          <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 16 }}>
            <IconMC name="bell-outline" size={28} color="#b0b5c3" style={styles.headerIcon} />
            <View style={styles.dot} />
          </View>
          <IconMC name="account-circle-outline" size={28} color="#b0b5c3" style={styles.headerIcon} />
        </View>
      </View>

      {/* MENÚ PRINCIPAL */}
      <ScrollView
        style={styles.menuList}
        contentContainerStyle={[styles.menuListContent, { paddingBottom: 90 }]} // deja lugar para el botón salir y menú inferior
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation(item.key)}
          >
            <View style={styles.iconWrapper}>{item.icon}</View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <IconMI name="chevron-right" size={24} color="#b0b5c3" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTÓN SALIR SIEMPRE ARRIBA DEL MENÚ INFERIOR */}
  <View style={styles.exitButtonContainer}>
     <TouchableOpacity
       style={styles.exitButton}
       onPress={() => {
         // Limpiá token, sesión, etc. si querés
         navigation.replace('Welcome');
       }}
     >
       <Image source={icons.salir} style={styles.exitIcon} />
       <Text style={styles.exitLabel}>Salir</Text>
     </TouchableOpacity>
   </View>

      {/* MENÚ INFERIOR */}
      <MainView />
    </View>
  );
}
