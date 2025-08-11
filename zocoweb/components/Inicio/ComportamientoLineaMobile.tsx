import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DarkModeContext } from '@context/DarkModeContext';

type DiaValor = { key: string; value: number };
type Totales = Record<string, DiaValor[]>;

type Props = {
  datos: {
    totalesPorDiaTarjeta?: Totales;
  };
};

const screenWidth = Dimensions.get('window').width;

const ComportamientoLineaMobile: React.FC<Props> = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);
  const tickColor = darkMode ? '#fff' : '#292B2F';
  const cardBg = darkMode ? '#1E1F23' : '#FFFFFF';

  const totalesPorDiaTarjeta = datos?.totalesPorDiaTarjeta || {};
  const tiendas = Object.keys(totalesPorDiaTarjeta);

  const diasArray = useMemo(() => {
    const dias = new Set<string>();
    for (const t of tiendas) (totalesPorDiaTarjeta[t] || []).forEach(v => dias.add(v.key));
    const orden: Record<string, number> = {
      Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 7,
      lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6, domingo: 7,
    };
    return Array.from(dias).sort((a, b) => (orden[a] || 99) - (orden[b] || 99));
  }, [tiendas, totalesPorDiaTarjeta]);

  const toNumber = (x: any) => {
    if (typeof x === 'number') return x;
    if (typeof x === 'string') {
      const s = x.replace(/[$\s.]/g, '').replace(',', '.');
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const lineData = useMemo(() => {
    if (!tiendas.length || !diasArray.length) return { labels: [], datasets: [{ data: [0] }] };
    const palette = ['#7dd3fc','#a7f3d0','#fca5a5','#fde68a','#c7d2fe','#f9a8d4','#93c5fd','#86efac'];
    const datasets = tiendas.map((t, i) => {
      const valores = diasArray.map(d =>
        toNumber((totalesPorDiaTarjeta[t] || []).find(v => v.key === d)?.value ?? 0)
      );
      const color = palette[i % palette.length];
      return { data: valores, color: () => color, strokeWidth: 2, withDots: true };
    });
    return { labels: diasArray, datasets };
  }, [tiendas, diasArray, totalesPorDiaTarjeta]);

  return (
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
  );
};

export default ComportamientoLineaMobile;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { textAlign: 'center', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  chart: { borderRadius: 12 },
});
