import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '@context/DarkModeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ⬇️ ajustá las rutas si tus assets están en otro lado
const logozoco = require('../../assets/img/Logo-ZOCO-4.png');
const logopayway = require('../../assets/img/payway-texto.png');
const logomercadopago = require('../../assets/img/Logo-Mercado-Pago-4.png');
const logonx = require('../../assets/img/Logo-Naranja-X-4.png');
const logogetnet = require('../../assets/img/Logo-Getnet-4.png');
const logoviumi = require('../../assets/img/Logo-viuMi-(Con-espacio-abajo).png');
const logoNave = require('../../assets/img/Logo-Nave-(Con-espacio-abajo).png');

type Props = {
  ahorroMercadoPago: number | string | null;
  ahorroPayway: number | string | null;
  ahorroNaranjaX: number | string | null;
  ahorroGetnet: number | string | null;
  ahorroViumi: number | string | null;
  ahorroNave: number | string | null;
  netoZoco: number | string | null;
};

export default function TituloPaginaAhorroMobile(props: Props) {
  const {
    ahorroMercadoPago,
    ahorroPayway,
    ahorroNaranjaX,
    ahorroGetnet,
    ahorroViumi,
    ahorroNave,
    netoZoco,
  } = props;

  const { darkMode } = useContext(DarkModeContext);

  const items = useMemo(
    () => [
      { logo: logopayway, ahorro: ahorroPayway, size: 40 },
      { logo: logomercadopago, ahorro: ahorroMercadoPago, size: 35 },
      { logo: logogetnet, ahorro: ahorroGetnet, size: 32 },
      { logo: logoNave, ahorro: ahorroNave, size: 60 },
      { logo: logonx, ahorro: ahorroNaranjaX, size: 32 },
      { logo: logoviumi, ahorro: ahorroViumi, size: 60 },
    ],
    [ahorroPayway, ahorroMercadoPago, ahorroGetnet, ahorroNave, ahorroNaranjaX, ahorroViumi]
  );

  // animación tipo marquee (duplicamos el contenido para loop suave)
  const translateX = useRef(new Animated.Value(0)).current;
  const [rowWidth, setRowWidth] = useState<number>(SCREEN_WIDTH);
  const [paused, setPaused] = useState(false);

  const DURATION_PER_SCREEN = 20000; // 20s por ancho de pantalla (ajustable)

  const start = () => {
    translateX.setValue(0);
    Animated.timing(translateX, {
      toValue: -rowWidth, // movemos una fila completa
      duration: Math.max(8000, (rowWidth / SCREEN_WIDTH) * DURATION_PER_SCREEN),
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !paused) start(); // loop
    });
  };

  useEffect(() => {
    if (!paused && rowWidth > 0) start();
    return () => translateX.stopAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowWidth, paused]);

  const currency = (v: any) =>
    v === null || v === undefined || v === '' ? '-' : `${v}`;

  const Comparativa = ({ logo, ahorro, size }: { logo: any; ahorro: any; size: number }) => (
    <View style={styles.comparativa}>
      <View style={styles.verticalDivider} />
      {/* Zoco */}
      <Image source={logozoco} style={[styles.logoZoco, { width: 70 }]} resizeMode="contain" />
      <View style={styles.ahorroBox}>
        <IconMC name="arrow-up-bold" size={18} style={styles.up} />
        <View style={styles.valorCol}>
          <Text style={styles.valor}>{currency(netoZoco)}</Text>
          <Text style={styles.recibis}>(recibís)</Text>
        </View>
      </View>

      <Text style={styles.vs}>VS</Text>

      {/* Competidor */}
      <Image source={logo} style={[styles.logoComp, { width: size }]} resizeMode="contain" />
      <View style={styles.ahorroBox}>
        <IconMC name="arrow-down-bold" size={18} style={styles.down} />
        <View style={styles.valorCol}>
          <Text style={styles.valor}>{currency(ahorro)}</Text>
          <Text style={styles.recibis}>(recibís)</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: darkMode ? '#15171D' : '#ffffff' },
      ]}
    >
      <TouchableWithoutFeedback
        onPressIn={() => setPaused(true)}
        onPressOut={() => setPaused(false)}
      >
        <View style={styles.scrollerContainer}>
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX }],
              width: rowWidth * 2, // 2 filas (duplicado)
            }}
          >
            {/* fila A */}
            <View
              style={styles.row}
              onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
            >
              {items.map((it, idx) => (
                <Comparativa key={`A-${idx}`} {...it} />
              ))}
            </View>

            {/* fila B (duplicada para loop suave) */}
            <View style={styles.row}>
              {items.map((it, idx) => (
                <Comparativa key={`B-${idx}`} {...it} />
              ))}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    height: 100,
    overflow: 'hidden',
    // sutil sombra
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  scrollerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  comparativa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'gray',
    marginHorizontal: 12,
    opacity: 0.5,
  },
  logoZoco: { height: 24, marginRight: 8 },
  logoComp: { height: 24, marginRight: 8 },
  ahorroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  up: { color: '#26b803', marginRight: 4 },
  down: { color: 'red', marginRight: 4 },
  valorCol: { alignItems: 'center' },
  valor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  recibis: {
    fontSize: 11,
    color: 'gray',
    marginTop: -2,
  },
  vs: {
    fontWeight: '700',
    marginHorizontal: 6,
    color: '#40424A',
  },
});
