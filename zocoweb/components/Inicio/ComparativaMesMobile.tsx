import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';
// si no usás alias, cambiá a: ../../context/DarkModeContext
import { DarkModeContext } from '@context/DarkModeContext';

type Props = {
  datos: {
    comparativahoy?: number | string;
    comparativaHoymesanterior?: number | string;
    comparativadiasemana?: string;
    porcentaje?: number | string; // decimal: 0.12
    comparativaMes?: { mesActual?: string; mesAnterior?: string };
  };
};

const screenWidth = Dimensions.get('window').width;

const toNumber = (x: any) => {
  if (typeof x === 'number') return x;
  if (typeof x === 'string') {
    const s = x.replace(/[$\s.]/g, '').replace(',', '.');
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const ComparativaMesMobile: React.FC<Props> = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);
  const tickColor = darkMode ? '#fff' : '#292B2F';
  const cardBg = darkMode ? '#1E1F23' : '#FFFFFF';

  const {
    comparativahoy = 0,
    comparativaHoymesanterior = 0,
    comparativadiasemana = '',
    porcentaje = 0,
    comparativaMes = {},
  } = datos || {};
  const { mesActual = 'Actual', mesAnterior = 'Anterior' } = comparativaMes || {};

  const vAnterior = toNumber(comparativaHoymesanterior);
  const vActual = toNumber(comparativahoy);
  const pct = Math.round(toNumber(porcentaje) * 100 * 100) / 100; // ej: 12.34

  const up = pct > 0;
  const down = pct < 0;
  const accent = up ? '#22c55e' : down ? '#ef4444' : '#8e9bb3';

  const barData = {
    labels: [mesAnterior, mesActual],
    datasets: [{ data: [vAnterior, vActual] }],
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.title, { color: tickColor }]}>
        Comparativa mes anterior
      </Text>
      <Text style={[styles.subtitle, { color: tickColor }]}>
        (1° hasta hoy)
      </Text>

      <View style={styles.row}>
        {/* Izquierda: barras */}
        <View style={styles.left}>
          <BarChart
            data={barData}
            width={screenWidth - 32 - 88 /* deja lugar a la derecha */}
            height={220}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars
            yAxisSuffix=""
            barPercentage={0.55}
            chartConfig={{
              backgroundGradientFrom: cardBg,
              backgroundGradientTo: cardBg,
              decimalPlaces: 0,
              color: (o = 1) => `rgba(180,196,0,${o})`, // verde ZOCO
              labelColor: () => tickColor,
              propsForLabels: { fontSize: 11 },
            }}
            style={styles.chart}
          />
        </View>

        {/* Divisor */}
        <View style={[styles.divider, { backgroundColor: darkMode ? '#2A2B30' : '#E7EAF3' }]} />

        {/* Derecha: flecha + % */}
        <View style={styles.right}>
          <Icon
            name={up ? 'arrow-up-right' : down ? 'arrow-down-right' : 'minus'}
            size={36}
            color={accent}
            style={{ marginBottom: 6 }}
          />
          <Text style={[styles.bigPct, { color: accent }]}>
            {up ? '+' : ''}{pct.toFixed(0)}%
          </Text>
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
  left: { flexGrow: 1 },
  divider: { width: 1, height: 200, marginHorizontal: 8, borderRadius: 1 },
  right: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPct: { fontSize: 28, fontWeight: '800', letterSpacing: 0.3 },
  chart: { borderRadius: 12 },
});
