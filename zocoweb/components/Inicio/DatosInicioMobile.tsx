import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type DatosProps = {
  datos: {
    totalBrutoMes: number;
    totalNetoMes: number;
    totalNetoMañana: number;
    totalNetoHoy: number;
  };
};

const DatosInicioMobile: React.FC<DatosProps> = ({ datos }) => {
  const fmt = (v: number) => {
    if (!v || isNaN(v)) return '$0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    })
      .format(v)
      .replace('ARS', '')
      .trim();
  };

  const cards = useMemo(
    () => [
      { title: 'Hoy se acredita', value: fmt(datos.totalNetoHoy) },
      { title: 'Mañana se acredita', value: fmt(datos.totalNetoMañana) },
      { title: 'Total bruto', value: fmt(datos.totalBrutoMes) },
      { title: 'Total neto', value: fmt(datos.totalNetoMes) },
    ],
    [datos]
  );

  return (
    <View style={styles.section}>
      <View style={styles.wrapper}>
        {cards.map((c, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.title}>{c.title}</Text>
            <View style={styles.separator} />
            <Text style={styles.amount}>{c.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DatosInicioMobile;

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff', // Fondo general blanco
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#d9d9d9',
    width: '70%',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },
});
