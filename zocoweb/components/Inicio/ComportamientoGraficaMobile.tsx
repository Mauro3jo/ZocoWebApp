import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

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
  const tickColor = '#292B2F';
  const cardBg = '#FFFFFF';

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
  }, [tiendas, totales]()
