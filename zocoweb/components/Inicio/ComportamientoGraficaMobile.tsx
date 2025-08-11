import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { DarkModeContext } from '@context/DarkModeContext';

type DiaValor = { key: string; value: number };
type Totales = Record<string, DiaValor[]>;

type Props = {
  datos: {
    comparativahoy?: number;
    comparativaHoymesanterior?: number;
    comparativadiasemana?: string;
    porcentaje?: number; // decimal: 0.12 -> 12%
    totalesPorDiaTarjeta?: Totales;
    comparativaMes?: { mesActual?: string; mesAnterior?: string };
  };
};

const screenWidth = Dimensions.get('window').width;

const ComportamientoGraficaMobile: React.FC<Props> = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);
  const tickColor = darkMode ? '#fff' : '#292B2F';
  const cardBg = darkMode ? '#1E1F23' : '#FFFFFF';

  const {
    comparativahoy = 0,
    comparativaHoymesanterior = 0,
    comparativadiasemana = '',
    porcentaje = 0,
    totalesPorDiaTarjeta = {},
    comparativaMes = {},
  } = datos || {};

  const { mesActual = 'Actual', mesAnterior = 'Anterior' } = comparativaMes || {};

  // tiendas y días
  const tiendas = Object.keys(totalesPorDiaTarjeta);

  const diasArray = useMemo(() => {
    const dias = new Set<string>();
    for (const t of tiendas) {
      (totalesPorDiaTarjeta[t] || []).forEach(v => dias.add(v.key));
    }
    const orden: Record<string, number> = {
      Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 7,
      lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6, domingo: 7,
    };
    return Array.from(dias).sort((a, b) => (orden[a] || 99) - (orden[b] || 99));
  }, [tiendas, totalesPorDiaTarjeta]);

  // datasets para LineChart
  const lineData = useMemo(() => {
    const palette = [
      '#7dd3fc','#a7f3d0','#fca5a5','#fde68a','#c7d2fe','#f9a8d4',
      '#93c5fd','#86efac','#fcd34d','#fda4af','#d8b4fe','#6ee7b7'
    ];
    const datasets = tiendas.map((t, i) => {
      const valores = diasArray.map(d =>
        (totalesPorDiaTarjeta[t] || []).find(v => v.key === d)?.value ?? 0
      );
      const color = palette[i % palette.length];
      return {
        data: valores,
        color: () => color,
        strokeWidth: 2,
        withDots: true,
      };
    });
    return { labels: diasArray, datasets };
  }, [tiendas, diasArray, totalesPorDiaTarjeta]);

  // datos para BarChart (comparativa meses)
  const barData = {
    labels: [mesAnterior, mesActual],
    datasets: [{ data: [comparativaHoymesanterior, comparativahoy] }],
  };

  const porcentajeEntero = Math.round((porcentaje ?? 0) * 100 * 100) / 100; // x100 y 2 decimales

  return (
    <View style={styles.wrapper}>
      {/* Line */}
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: tickColor }]}>Comportamiento de ventas</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 32}
          height={220}
          withInnerLines={false}
          withShadow={false}
          chartConfig={{
            backgroundGradientFrom: cardBg,
            backgroundGradientTo: cardBg,
            decimalPlaces: 0,
            color: (o=1) => `rgba(180,196,0,${o})`,
            labelColor: () => tickColor,
            propsForLabels: { fontSize: 11 },
            propsForDots: { r: '3' },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Bars */}
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: tickColor }]}>
          Comparativa (igual {comparativadiasemana} mes anterior)
        </Text>
        <BarChart
          data={barData}
          width={screenWidth - 32}
          height={220}
          fromZero
          withInnerLines={false}
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: cardBg,
            backgroundGradientTo: cardBg,
            decimalPlaces: 0,
            color: (o=1) => `rgba(180,196,0,${o})`,
            labelColor: () => tickColor,
            propsForLabels: { fontSize: 11 },
          }}
          style={styles.chart}
          yAxisSuffix=""
          barPercentage={0.6}
        />
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: darkMode ? '#2A2B30' : '#F5F7FB' }]}>
            <Text style={[styles.badgeText, { color: porcentajeEntero > 0 ? '#22c55e' : porcentajeEntero < 0 ? '#ef4444' : tickColor }]}>
              {porcentajeEntero > 0 ? '▲ ' : porcentajeEntero < 0 ? '▼ ' : '■ '}
              {porcentajeEntero.toFixed(2)} %
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ComportamientoGraficaMobile;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
  badgeRow: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
