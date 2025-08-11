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
    try {
      const f = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);
      const partes = f.split(',');
      partes[0] = partes[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return partes.join(',');
    } catch {
      return `$ ${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }
  };

  const cards = useMemo(
    () => [
      { title: 'Hoy se acredita', value: fmt(datos.totalNetoHoy) },
      { title: 'Mañana se acredita', value: fmt(datos.totalNetoMañana) },
      { title: 'Total Bruto', value: fmt(datos.totalBrutoMes) },
      { title: 'Total Neto', value: fmt(datos.totalNetoMes) },
    ],
    [datos]
  );

  return (
    <View style={styles.wrapper}>
      {cards.map((c, i) => (
        <View key={i} style={[styles.card, styles.cardLight]}>
          <Text style={styles.title}>{c.title}</Text>
          <Text style={styles.amount}>$ {c.value}</Text>
        </View>
      ))}
    </View>
  );
};

export default DatosInicioMobile;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2b2b2b',
  },
  amount: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: '#2b2b2b',
  },
});
