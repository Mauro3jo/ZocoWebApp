import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";

type DiaValor = { key: string; value: number };
type Totales = Record<string, DiaValor[]>;

type Props = {
  datos: {
    comparativahoy?: number;
    comparativaHoymesanterior?: number;
    comparativadiasemana?: string;
    porcentaje?: number;
    totalesPorDiaTarjeta?: Totales;
    comparativaMes?: { mesActual?: string; mesAnterior?: string };
  };
};

const screenWidth = Dimensions.get("window").width;

const ComportamientoGraficaMobile: React.FC<Props> = ({ datos }) => {
  const tickColor = "#292B2F";
  const cardBg = "#FFFFFF";

  const {
    comparativahoy = 0,
    comparativaHoymesanterior = 0,
    comparativadiasemana = "",
    porcentaje = 0,
    totalesPorDiaTarjeta = {},
    comparativaMes = {},
  } = datos || {};

  const { mesActual = "Actual", mesAnterior = "Anterior" } = comparativaMes || {};

  const tiendas = Object.keys(totalesPorDiaTarjeta);

  const diasArray = useMemo(() => {
    const dias = new Set<string>();
    for (const t of tiendas) {
      (totalesPorDiaTarjeta[t] || []).forEach((v) => dias.add(v.key));
    }
    const orden: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 7,
    };
    return Array.from(dias).sort((a, b) => (orden[a] || 99) - (orden[b] || 99));
  }, [tiendas, totalesPorDiaTarjeta]);

  // Configuración del gráfico
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(180,196,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(41,43,47,${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#B4C400" },
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.title, { color: tickColor }]}>
        Comportamiento semanal
      </Text>
      <Text style={[styles.subtitle, { color: tickColor }]}>
        Promedio diario por tarjeta
      </Text>

      {tiendas.map((tienda) => {
        const valores = totalesPorDiaTarjeta[tienda] || [];
        const labels = valores.map((v) => v.key);
        const data = valores.map((v) => v.value);

        return (
          <View key={tienda} style={styles.chartBlock}>
            <Text style={[styles.chartTitle, { color: tickColor }]}>
              {tienda}
            </Text>

            <LineChart
              data={{
                labels,
                datasets: [{ data }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ComportamientoGraficaMobile;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
  chartBlock: {
    marginTop: 10,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Montserrat_600SemiBold",
  },
  chart: {
    borderRadius: 12,
  },
});
