// src/screens/Inicio.tsx
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';
import TituloPaginaAhorroMobile from '../components/Inicio/TituloPaginaAhorroMobile';
import DatosInicioMobile from '../components/Inicio/DatosInicioMobile';

import { InicioAhorroContext } from '../src/context/InicioAhorroContext';
import { DatosInicioContext } from '../src/context/DatosInicioContext';

export default function Inicio() {
  const {
    ahorroMercadoPago,
    ahorroPayway,
    ahorroNaranjaX,
    ahorroGetnet,
    ahorroViumi,
    ahorroNave,
    netoZoco,
  } = useContext(InicioAhorroContext);

  const { datosBackContext } = useContext(DatosInicioContext);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderPrincipal />
      <FiltrosBar />

      <TituloPaginaAhorroMobile
        ahorroMercadoPago={ahorroMercadoPago}
        ahorroPayway={ahorroPayway}
        ahorroNaranjaX={ahorroNaranjaX}
        ahorroGetnet={ahorroGetnet}
        ahorroViumi={ahorroViumi}
        ahorroNave={ahorroNave}
        netoZoco={netoZoco}
      />

      {/* Bloque de datos como en la app de escritorio */}
      <DatosInicioMobile datos={datosBackContext} />

      <View style={{ flex: 1, marginTop: 12 }}>
        <MainView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
});
