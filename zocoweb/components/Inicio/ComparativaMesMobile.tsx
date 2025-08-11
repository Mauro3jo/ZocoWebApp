import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { DarkModeContext } from '@context/DarkModeContext';

type Props = {
  datos: {
    comparativahoy?: number | string;
    comparativaHoymesanterior?: number | string;
    porcentaje?: number | string; // ej: 0.12
    comparativaMes?: { mesActual?: string; mesAnterior?: string };
  };
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const toNumber = (x: any) => {
  if (typeof x === 'number') return x;
  if (typeof x === 'string') {
    const s = x.replace(/[$\s.]/g, '').replace(',', '.');
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const BAR_HEIGHT = 170;
const BAR_WIDTH = 42;

const CapsuleBar: React.FC<{
  value: number;
  max: number;
  outline: string;
  fill: string;
}> = ({ value, max, outline, fill }) => {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const fillH = Math.round(pct * (BAR_HEIGHT - 2)); // -2 por border
  return (
    <View style={[styles.capsule, { borderColor: outline }]}>
      <View style={[styles.capsuleFill, { height: fillH, backgroundColor: fill }]} />
    </View>
  );
};

const ComparativaMesMobile: React.FC<Props> = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);

  const tickColor = darkMode ? '#fff' : '#292B2F';
  const cardBg = darkMode ? '#1E1F23' : '#FFFFFF';
  const outline = darkMode ? '#AAB1C5' : '#2F3341';
  const accentFill = '#B4C400'; // verde ZOCO

  const {
    comparativahoy = 0,
    comparativaHoymesanterior = 0,
    porcentaje = 0,
    comparativaMes = {},
  } = datos || {};
  const { mesActual = 'Actual', mesAnterior = 'Anterior' } = comparativaMes || {};

  const vAnterior = toNumber(comparativaHoymesanterior);
  const vActual = toNumber(comparativahoy);
  const pct = useMemo(
    () => Math.round(toNumber(porcentaje) * 100), // entero
    [porcentaje]
  );

  const maxVal = Math.max(vAnterior, vActual, 1);
  const up = pct > 0;
  const down = pct < 0;
  const accent = up ? '#22c55e' : down ? '#ef4444' : '#8e9bb3';

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.title, { color: tickColor }]}>Comparativa mes anterior</Text>
      <Text style={[styles.subtitle, { color: tickColor }]}>(1° hasta hoy)</Text>

      <View style={styles.row}>
        {/* Mitad izquierda: “cilindros” */}
        <View style={styles.left}>
          {/* líneas guía suaves (opcional) */}
          <View style={[styles.hline, { backgroundColor: darkMode ? '#2A2B30' : '#EDEFF5', top: 40 }]} />
          <View style={[styles.hline, { backgroundColor: darkMode ? '#2A2B30' : '#EDEFF5', top: 110 }]} />

          <View style={styles.barZone}>
            <View style={styles.barBlock}>
              <CapsuleBar value={vAnterior} max={maxVal} outline={outline} fill={accentFill} />
              <Text style={[styles.barLabel, { color: tickColor }]}>{mesAnterior}</Text>
            </View>

            <View style={{ width: 20 }} />

            <View style={styles.barBlock}>
              <CapsuleBar value={vActual} max={maxVal} outline={outline} fill={accentFill} />
              <Text style={[styles.barLabel, { color: tickColor }]}>{mesActual}</Text>
            </View>
          </View>
        </View>

        {/* divisor */}
        <View style={[styles.divider, { backgroundColor: darkMode ? '#2A2B30' : '#E7EAF3' }]} />

        {/* Mitad derecha: flecha + % */}
        <View style={styles.right}>
          <Icon
            name={up ? 'arrow-up-right' : down ? 'arrow-down-right' : 'minus'}
            size={40}
            color={accent}
            style={{ marginBottom: 6 }}
          />
          <Text style={[styles.bigPct, { color: accent }]}>{up ? '+' : ''}{pct}%</Text>
        </View>
      </View>
    </View>
  );
};

export default ComparativaMesMobile;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { textAlign: 'center', fontSize: 16, fontWeight: '700' },
  subtitle: { textAlign: 'center', fontSize: 12, opacity: 0.8, marginBottom: 8 },

  row: { flexDirection: 'row', alignItems: 'center' },

  left: { width: SCREEN_WIDTH * 0.5 - 32, position: 'relative' },
  hline: { position: 'absolute', left: 0, right: 0, height: 1, borderRadius: 1 },

  barZone: { height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  barBlock: { alignItems: 'center' },

  capsule: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderWidth: 2,
    borderRadius: BAR_WIDTH / 2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  capsuleFill: {
    width: '100%',
    borderBottomLeftRadius: BAR_WIDTH / 2,
    borderBottomRightRadius: BAR_WIDTH / 2,
  },
  barLabel: { marginTop: 6, fontSize: 12 },

  divider: { width: 1, height: 200, marginHorizontal: 10, borderRadius: 1 },

  right: { width: SCREEN_WIDTH * 0.5 - 32, alignItems: 'center', justifyContent: 'center', height: 200 },
  bigPct: { fontSize: 32, fontWeight: '800', letterSpacing: 0.3 },
});
