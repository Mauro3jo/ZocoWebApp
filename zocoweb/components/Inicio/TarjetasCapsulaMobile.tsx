import React, { useContext, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DarkModeContext } from '@context/DarkModeContext';

type Item = { tarjeta: string; totalConDescuento?: number | string };
type Props = {
  datos: { descuentosPorTarjeta?: Item[] };
};

const toNumber = (x: any) => {
  if (typeof x === 'number') return x;
  if (typeof x === 'string') {
    const n = Number(x.replace(/[$\s.]/g, '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

// 🔧 ajustá rutas si tus assets están en otro lado
const logos: Record<string, any> = {
  Visa: require('../../assets/img/visa.png'),
  MasterCard: require('../../assets/img/mastercard.png'),
  'Mastercard': require('../../assets/img/mastercard.png'),
  Amex: require('../../assets/img/amex.png'),
  'American Express': require('../../assets/img/amex.png'),
  Cabal: require('../../assets/img/cabal.png'),
  Diners: require('../../assets/img/diners.png'),
  Argencard: require('../../assets/img/argencard.png'),
  Naranjax: require('../../assets/img/naranjax.png'),
};

const BAR_HEIGHT = 14;

const TarjetasCapsulaMobile: React.FC<Props> = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);

  const items = useMemo(() => {
    const list = (datos?.descuentosPorTarjeta ?? []).map(it => ({
      nombre: it.tarjeta,
      valor: toNumber(it.totalConDescuento),
      logo: logos[it.tarjeta] ?? null,
    }));
    // ordenar desc por valor
    return list.sort((a, b) => b.valor - a.valor);
  }, [datos]);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.valor, 0),
    [items]
  );

  const bgCard = darkMode ? '#1E1F23' : '#FFFFFF';
  const labelColor = darkMode ? '#FFFFFF' : '#2B2F3A';
  const fillColor = '#B4C400';          // verde ZOCO
  const restColor = darkMode ? '#3A3E47' : '#C9D1EC'; // “gris-lila” resto

  if (!items.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: bgCard }]}>
      {items.map((it, idx) => {
        const pct = total > 0 ? Math.max(0, Math.min(1, it.valor / total)) : 0;
        return (
          <View key={`${it.nombre}-${idx}`} style={styles.row}>
            {/* logo + label */}
            <View style={styles.left}>
              {it.logo ? (
                <Image source={it.logo} style={styles.logo} resizeMode="contain" />
              ) : (
                <Text style={[styles.fallback, { color: labelColor }]}>{it.nombre}</Text>
              )}
            </View>

            {/* barra tipo cápsula */}
            <View style={[styles.barTrack, { backgroundColor: restColor }]}>
              <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: fillColor }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TarjetasCapsulaMobile;

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  left: { width: 88, alignItems: 'flex-start', justifyContent: 'center' },
  logo: { width: 72, height: 26 },
  fallback: { fontSize: 12, fontWeight: '700' },

  barTrack: {
    flex: 1,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BAR_HEIGHT / 2,
  },
});
