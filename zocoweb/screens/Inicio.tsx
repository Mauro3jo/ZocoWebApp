import React, { useContext, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';
import TituloPaginaAhorroMobile from '../components/Inicio/TituloPaginaAhorroMobile';
import DatosInicioMobile from '../components/Inicio/DatosInicioMobile';
import ComportamientoLineaMobile from '../components/Inicio/ComportamientoLineaMobile';
import ComparativaMesMobile from '../components/Inicio/ComparativaMesMobile';
import TarjetasCapsulaMobile from '../components/Inicio/TarjetasCapsulaMobile';

import { InicioAhorroContext } from '../src/context/InicioAhorroContext';
import { DatosInicioContext } from '../src/context/DatosInicioContext';

import styles from './Inicio.styles'; // ✅ mismo folder

const TABBAR_HEIGHT = 64; // altura visual del menú

export default function Inicio() {
  const insets = useSafeAreaInsets();

  const {
    ahorroMercadoPago,
    ahorroPayway,
    ahorroNaranjaX,
    ahorroGetnet,
    ahorroViumi,
    ahorroNave,
    netoZoco,
  } = useContext(InicioAhorroContext);

  const { datosBackContext } =
    useContext(DatosInicioContext) ?? { datosBackContext: null };

  const tieneLinea = useMemo(() => {
    const t = datosBackContext?.totalesPorDiaTarjeta;
    return t && Object.keys(t).length > 0;
  }, [datosBackContext]);

  const tieneBarras = useMemo(() => {
    const d = datosBackContext || {};
    return (
      d?.comparativahoy != null ||
      d?.comparativaHoymesanterior != null ||
      d?.comparativaMes
    );
  }, [datosBackContext]);

  const tieneCapsulas = useMemo(() => {
    const arr = datosBackContext?.descuentosPorTarjeta;
    return Array.isArray(arr) && arr.length > 0;
  }, [datosBackContext]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <TituloPaginaAhorroMobile
          ahorroMercadoPago={ahorroMercadoPago}
          ahorroPayway={ahorroPayway}
          ahorroNaranjaX={ahorroNaranjaX}
          ahorroGetnet={ahorroGetnet}
          ahorroViumi={ahorroViumi}
          ahorroNave={ahorroNave}
          netoZoco={netoZoco}
        />

        {datosBackContext && <DatosInicioMobile datos={datosBackContext} />}
        {tieneLinea && <ComportamientoLineaMobile datos={datosBackContext} />}
        {tieneBarras && <ComparativaMesMobile datos={datosBackContext} />}
        {tieneCapsulas && <TarjetasCapsulaMobile datos={datosBackContext} />}
      </ScrollView>

      {/* Menú fijo abajo con safe area real */}
      <View style={styles.tabbarContainer}>
        <SafeAreaView edges={['bottom']} style={styles.tabbar}>
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
