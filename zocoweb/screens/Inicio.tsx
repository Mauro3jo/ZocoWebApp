import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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

const TABBAR_HEIGHT = 64; // altura visual del menú

export default function Inicio() {
  const insets = useSafeAreaInsets(); // <- para respetar la zona segura inferior

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

  // Altura efectiva del tabbar sumando la zona segura inferior (ej. barra gestual)
  const TABBAR_EFFECTIVE = TABBAR_HEIGHT + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HeaderPrincipal />
      <FiltrosBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: TABBAR_EFFECTIVE + 16 }}
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

      {/* Menú fijo abajo, con padding para no chocar con la barra del sistema */}
      <View style={[styles.tabbar, { height: TABBAR_EFFECTIVE, paddingBottom: insets.bottom }]}>
        <MainView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  scroll: { flex: 1 },
  tabbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // pegado al borde inferior pero respetando safe area con paddingBottom
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E3E6EE',
    backgroundColor: '#fff',
    // sombra sutil
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
});
