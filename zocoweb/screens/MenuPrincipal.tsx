import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import styles from './MenuPrincipal.styles';
import MainView from '../components/MainView';

// 🟩 Íconos SVG
import HomeIcon from '../assets/svg/casa 1.svg';
import DolarIcon from '../assets/svg/dolar 1.svg';
import LupaIcon from '../assets/svg/lupa 1.svg';
import ArchivoIcon from '../assets/svg/archivo-2 1.svg';
import CorazonIcon from '../assets/svg/corazon 1.svg';
import ChatBotIcon from '../assets/svg/chat-bot 1.svg';
import CalculadoraIcon from '../assets/svg/calculadora-2 1.svg';
import WhatsAppIcon from '../assets/svg/whatsapp-2 1.svg';
import SalirIcon from '../assets/svg/cerrar-sesion-2 1.svg';

const logo = require('../assets/img/Logo-login.png');

const COLOR_NEGRO = '#2E3136';

const menuItems = [
  { key: 'inicio', label: 'Inicio', icon: <HomeIcon width={24} height={24} color={COLOR_NEGRO} /> },
  { key: 'contabilidad', label: 'Contabilidad', icon: <DolarIcon width={24} height={24} color={COLOR_NEGRO} /> },
  { key: 'analisis', label: 'Análisis', icon: <LupaIcon width={24} height={24} color={COLOR_NEGRO} /> },
  { key: 'cupones', label: 'Cupones', icon: <ArchivoIcon width={24} height={24} color={COLOR_NEGRO} /> },
    { key: 'simulador', label: 'Simulador', icon: <CalculadoraIcon width={24} height={24} color={COLOR_NEGRO} /> },
  { key: 'consultas', label: 'Consultas', icon: <ChatBotIcon width={24} height={24} color={COLOR_NEGRO} /> },

  { key: 'calificar', label: 'Calificar', icon: <CorazonIcon width={24} height={24} color={COLOR_NEGRO} /> },
  { key: 'postventa', label: 'Postventa', icon: <WhatsAppIcon width={24} height={24} color={COLOR_NEGRO} /> },
];

export default function MenuPrincipal({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tabbarHeight, setTabbarHeight] = useState(0);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setTabbarHeight(e.nativeEvent.layout.height);
  };

  const handleNavigation = (key: string) => {
    switch (key) {
      case 'inicio': navigation.navigate('Inicio'); break;
      case 'contabilidad': navigation.navigate('Contabilidad'); break;
      case 'analisis': navigation.navigate('Analisis'); break;
      case 'cupones': navigation.navigate('Cupones'); break;
      case 'simulador': navigation.navigate('Simulador'); break;
      case 'consultas': navigation.navigate('Consultas'); break;
      case 'calificar': navigation.navigate('Calificar'); break;
      case 'postventa': navigation.navigate('Postventa'); break;
      default: console.log('Ruta no definida:', key);
    }
  };

  const EXIT_BTN_HEIGHT_PAD = 90;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerSpacer} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* MENÚ PRINCIPAL */}
      <ScrollView
        style={styles.menuList}
        contentContainerStyle={[
          styles.menuListContent,
          {
            paddingBottom: tabbarHeight + Math.max(insets.bottom, 8) + EXIT_BTN_HEIGHT_PAD,
          },
        ]}
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

      {/* BOTÓN SALIR */}
      <View
        style={[
          styles.exitButtonContainer,
          {
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: tabbarHeight + Math.max(insets.bottom, 8) + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.replace('Welcome')}
          activeOpacity={0.8}
        >
          <SalirIcon width={22} height={22} color="#fff" />
          <Text style={styles.exitLabel}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* MENÚ INFERIOR */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout}
      >
        <SafeAreaView
          edges={['bottom']}
          style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <MainView />
        </SafeAreaView>
      </View>
    </View>
  );
}
