import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";

type Props = {
  datos: {
    comparativahoy?: number | string;
    comparativaHoymesanterior?: number | string;
    porcentaje?: number | string;
    comparativaMes?: { mesActual?: string; mesAnterior?: string };
  };
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const toNumber = (x: any) => {
  if (typeof x === "number") return x;
  if (typeof x === "string") {
    const s = x.replace(/[$\s.]/g, "").replace(",", ".");
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const BAR_HEIGHT = 170;
const BAR_WIDTH = 42;

const RectBar: React.FC<{
  value: number;
  max: number;
  outline: string;
  fill: string;
}> = ({ value, max, outline, fill }) => {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const fillHeight = Math.round(pct * (BAR_HEIGHT - 2));

  return (
    <View style={[styles.rect, { borderColor: outline }]}>
      <View style={styles.fillContainer}>
        <View
          style={[
            styles.rectFill,
            {
              height: fillHeight,
              backgroundColor: fill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const ComparativaMesMobile: React.FC<Props> = ({ datos }) => {
  const tickColor = "#292B2F";
  const cardBg = "#FFFFFF";
  const outline = "#B4B6BE";
  const accentFill = "#B4C400";

  const {
    comparativahoy = 0,
    comparativaHoymesanterior = 0,
    porcentaje = 0,
    comparativaMes = {},
  } = datos || {};
  const { mesActual = "Actual", mesAnterior = "Anterior" } = comparativaMes || {};

  const vAnterior = toNumber(comparativaHoymesanterior);
  const vActual = toNumber(comparativahoy);
  const pct = useMemo(() => Math.round(toNumber(porcentaje) * 100), [porcentaje]);

  const maxVal = Math.max(vAnterior, vActual, 1);
  const up = pct > 0;
  const down = pct < 0;
  const accent = up ? "#22c55e" : down ? "#ef4444" : "#8e9bb3";

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
          <View style={[styles.hline, { backgroundColor: "#EDEFF5", top: 40 }]} />
          <View style={[styles.hline, { backgroundColor: "#EDEFF5", top: 110 }]} />

          <View style={styles.barZone}>
            <View style={styles.barBlock}>
              <RectBar
                value={vAnterior}
                max={maxVal}
                outline={outline}
                fill={accentFill}
              />
              <Text style={[styles.barLabel, { color: tickColor }]}>
                {mesAnterior}
              </Text>
            </View>

            <View style={{ width: 20 }} />

            <View style={styles.barBlock}>
              <RectBar
                value={vActual}
                max={maxVal}
                outline={outline}
                fill={accentFill}
              />
              <Text style={[styles.barLabel, { color: tickColor }]}>
                {mesActual}
              </Text>
            </View>
          </View>
        </View>

        {/* divisor */}
        <View style={[styles.divider, { backgroundColor: "#E7EAF3" }]} />

        {/* Derecha: flecha + % */}
        <View style={styles.right}>
          <Icon
            name={up ? "arrow-up-right" : down ? "arrow-down-right" : "minus"}
            size={40}
            color={accent}
            style={{ marginBottom: 6 }}
          />
          <Text style={[styles.bigPct, { color: accent }]}>
            {up ? "+" : ""}
            {pct}%
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
  row: { flexDirection: "row", alignItems: "center" },
  left: { width: SCREEN_WIDTH * 0.5 - 32, position: "relative" },
  hline: { position: "absolute", left: 0, right: 0, height: 1, borderRadius: 1 },
  barZone: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  barBlock: { alignItems: "center" },
  rect: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  fillContainer: { flex: 1, justifyContent: "flex-end" },
  rectFill: { width: "100%" },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  divider: { width: 1, height: 200, marginHorizontal: 10, borderRadius: 1 },
  right: {
    width: SCREEN_WIDTH * 0.5 - 32,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  bigPct: {
    fontSize: 32,
    letterSpacing: 0.3,
    fontFamily: "Montserrat_800ExtraBold",
  },
});
