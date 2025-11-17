// src/screens/Inicio.tsx
import React, { useContext, useMemo, useState } from 'react';
import { View, ScrollView, LayoutChangeEvent } from 'react-native';
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
import PopUpNotificacionMobile from "../components/Inicio/PopUpNotificacionMobile";

import styles from './Inicio.styles';

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

  // 🔹 altura real del tabbar
  const [tabbarHeight, setTabbarHeight] = useState(0);
  const onTabbarLayout = (e: LayoutChangeEvent) =>
    setTabbarHeight(e.nativeEvent.layout.height);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        // 🔽 agregado: +16px de espacio adicional para que el contenido no se pegue al menú inferior
        contentContainerStyle={{ paddingBottom: tabbarHeight + 16 }}
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
<PopUpNotificacionMobile/>   {/* ← Popup en celular */}

        {datosBackContext && <DatosInicioMobile datos={datosBackContext} />}
        {tieneLinea && <ComportamientoLineaMobile datos={datosBackContext} />}
        {tieneBarras && <ComparativaMesMobile datos={datosBackContext} />}
        {tieneCapsulas && <TarjetasCapsulaMobile datos={datosBackContext} />}
      </ScrollView>

      {/* Menú fijo abajo con safe area real */}
      <View
        style={styles.tabbarContainer}
        pointerEvents="box-none"
        onLayout={onTabbarLayout} // 👈 medimos altura real del tabbar
      >
        <SafeAreaView
          edges={['bottom']}
          style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <MainView />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
