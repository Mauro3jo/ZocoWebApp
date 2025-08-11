import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderPrincipal from '../components/HeaderPrincipal';
import FiltrosBar from '../components/FiltrosBar';
import MainView from '../components/MainView';
import TituloPaginaAhorroMobile from '../components/Inicio/TituloPaginaAhorroMobile';
import DatosInicioMobile from '../components/Inicio/DatosInicioMobile';
import ComportamientoLineaMobile from '../components/Inicio/ComportamientoLineaMobile';
import ComparativaMesMobile from '../components/Inicio/ComparativaMesMobile';

import { InicioAhorroContext } from '../src/context/InicioAhorroContext';
import { DatosInicioContext } from '../src/context/DatosInicioContext';

const TABBAR_HEIGHT = 64; // ajustá a la altura real de tu MainView

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

  const { datosBackContext } = useContext(DatosInicioContext) ?? { datosBackContext: null };

  const tieneLinea = useMemo(() => {
    const t = datosBackContext?.totalesPorDiaTarjeta;
    return t && Object.keys(t).length > 0;
  }, [datosBackContext]);

  const tieneBarras = useMemo(() => {
    const d = datosBackContext || {};
    return d?.comparativahoy != null || d?.comparativaHoymesanterior != null || d?.comparativaMes;
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
      </ScrollView>

      {/* Menú siempre fijo abajo */}
      <View style={styles.tabbar}>
        <MainView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  scroll: { flex: 1 },
  tabbar: {
    height: TABBAR_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E3E6EE',
    backgroundColor: '#fff',
  },
});
