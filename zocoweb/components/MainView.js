import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '../assets/svg/Home.svg';
import CampanaIcon from '../assets/svg/Campana.svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const SIDE_MARGIN = width * 0.10; // 10% de margen lateral

export default function MainView() {
  const navigation = useNavigation();

  const handleTabPress = (tab) => {
    if (tab === 'home') {
      navigation.navigate('Inicio');
    } else if (tab === 'notifications') {
      console.log('Ir a Notificaciones');
    } else if (tab === 'menu') {
      navigation.navigate('MenuPrincipal');
    }
  };

  return (
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
    paddingHorizontal: SIDE_MARGIN, // 10% de margen a cada lado
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
