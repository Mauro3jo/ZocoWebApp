import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

type Props = {
  datosBack?: {
    resumenUltimos7Meses?: {
      mes: string;
      totalBruto: number;                  // Monto (verde)
      totalBrutoMenosInflacion: number;    // Inflación (gris oscuro)
      cantidadDatos: number;               // Operaciones (gris claro)
    }[];
  } | null;
};

// 🎨 Colores actualizados
const GREEN = "#B4C400"; // Monto
const DARK_GREY = "#B1B1B1"; // Inflación (antes negro)
const LIGHT_GREY = "#C7C9D3"; // Operaciones (más claro)

// 🔹 Helper abreviar meses
const abreviarMes = (nombreMes: string) => {
  const mapa: Record<string, string> = {
    enero: "ene",
    febrero: "feb",
    marzo: "mar",
    abril: "abr",
    mayo: "may",
    junio: "jun",
    julio: "jul",
    agosto: "ago",
    septiembre: "sep",
    octubre: "oct",
    noviembre: "nov",
    diciembre: "dic",
  };
  const lower = nombreMes.toLowerCase();
  return mapa[lower] ?? nombreMes.slice(0, 3);
};

// 🔹 Helper para formatear pesos
const formatearAPeso = (valor: number) => {
  const valorFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor);
  const partes = valorFormateado.split(",");
  partes[0] = partes[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(",");
};

// Escala vertical
const scale = (v: number, vmax: number, pxMax: number) =>
  vmax > 0 ? Math.max(0, Math.min(pxMax, (v / vmax) * pxMax)) : 0;

export default function EvolucionMensual3BarrasMobile({ datosBack }: Props) {
  const [barraActiva, setBarraActiva] = useState(true); // Monto
  const [barraActivaInflacion, setBarraActivaInflacion] = useState(true);
  const [barraActivaOperaciones, setBarraActivaOperaciones] = useState(true);

  const width = Dimensions.get("window").width - 32;
  const height = 240;

  const PADDING_L = 0;
  const PADDING_R = 8;
  const PADDING_T = 12;
  const PADDING_B = 42;

  // datos
  const { meses, serieMonto, serieInfl, serieOps } = useMemo(() => {
    const raw = datosBack?.resumenUltimos7Meses ?? [];
    const asc = [...raw].reverse(); // viejo → nuevo
    const meses = asc.map((d) => abreviarMes(d.mes));
    const monto = asc.map((d) => d.totalBruto ?? 0);
    const infl = asc.map((d) => d.totalBrutoMenosInflacion ?? 0);
    const ops = asc.map((d) => d.cantidadDatos ?? 0);
    return { meses, serieMonto: monto, serieInfl: infl, serieOps: ops };
  }, [datosBack]);

  const visibles = useMemo(() => {
    const arr: Array<{ key: "monto" | "infl" | "ops"; data: number[] }> = [];
    if (barraActiva) arr.push({ key: "monto", data: serieMonto });
    if (barraActivaInflacion) arr.push({ key: "infl", data: serieInfl });
    if (barraActivaOperaciones) arr.push({ key: "ops", data: serieOps });
    return arr.length ? arr : [{ key: "ops", data: new Array(meses.length).fill(0) }];
  }, [
    barraActiva,
    barraActivaInflacion,
    barraActivaOperaciones,
    serieMonto,
    serieInfl,
    serieOps,
    meses.length,
  ]);

  const vmax = useMemo(() => {
    let mx = 1;
    visibles.forEach((s) => s.data.forEach((v) => (v > mx ? (mx = v) : null)));
    return mx;
  }, [visibles]);

  const chartW = width - PADDING_L - PADDING_R;
  const chartH = height - PADDING_T - PADDING_B;

  const groups = meses.length || 7;
  const innerGap = Math.max(4, Math.floor(chartW * 0.006));
  const minBarW = 8;
  const maxBarW = 16;
  let groupGap = Math.max(10, Math.floor(chartW * 0.02));
  let barW = Math.floor(
    (chartW - (groups - 1) * groupGap - groups * 2 * innerGap) / (groups * 3)
  );

  if (barW > maxBarW) barW = maxBarW;
  if (barW < minBarW) {
    const minGroupGap = 6;
    groupGap = Math.max(minGroupGap, groupGap - (minBarW - barW) * 3);
    barW = Math.max(
      minBarW,
      Math.floor(
        (chartW - (groups - 1) * groupGap - groups * 2 * innerGap) / (groups * 3)
      )
    );
  }

  const groupW = 3 * barW + 2 * innerGap;
  const totalW = groups * groupW + (groups - 1) * groupGap;
  const startX = Math.max(0, (chartW - totalW) / 2);

  const [tip, setTip] = useState<{ x: number; y: number; text: string; visible: boolean }>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const showTip = (x: number, y: number, serie: "monto" | "infl" | "ops", val: number) => {
    const text = serie === "ops" ? String(val) : formatearAPeso(val);
    setTip({ x, y, text, visible: true });
    setTimeout(() => setTip((t) => ({ ...t, visible: false })), 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Evolución mensual{"\n"}
        <Text style={styles.subtitle}>bruto</Text>
      </Text>

      {/* Switches */}
      <View style={styles.switchesRow}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Monto</Text>
          <Switch
            value={barraActiva}
            onValueChange={setBarraActiva}
            trackColor={{ true: GREEN, false: "#DDE0E6" }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Inflación</Text>
          <Switch
            value={barraActivaInflacion}
            onValueChange={setBarraActivaInflacion}
            trackColor={{ true: GREEN, false: "#DDE0E6" }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Operaciones</Text>
          <Switch
            value={barraActivaOperaciones}
            onValueChange={setBarraActivaOperaciones}
            trackColor={{ true: GREEN, false: "#DDE0E6" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Chart */}
      <View style={{ position: "relative" }}>
        <Svg width={width} height={height}>
          {meses.map((mes, gi) => {
            const baseX = PADDING_L + startX + gi * (groupW + groupGap);
            const slots: Array<{
              key: "monto" | "infl" | "ops";
              color: string;
              val: number;
              visible: boolean;
              idx: number;
            }> = [
              { key: "monto", color: GREEN, val: serieMonto[gi] ?? 0, visible: barraActiva, idx: 0 },
              { key: "infl", color: DARK_GREY, val: serieInfl[gi] ?? 0, visible: barraActivaInflacion, idx: 1 },
              { key: "ops", color: LIGHT_GREY, val: serieOps[gi] ?? 0, visible: barraActivaOperaciones, idx: 2 },
            ];

            return slots.map((s) => {
              if (!s.visible) return null;
              const h = scale(s.val, vmax, chartH);
              const x = baseX + s.idx * (barW + innerGap);
              const y = PADDING_T + (chartH - h);
              return (
                <Rect
                  key={`${mes}-${s.key}`}
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={s.color}
                  onPress={(e: any) => {
                    const { locationX, locationY } = e.nativeEvent;
                    showTip(PADDING_L + locationX, PADDING_T + locationY - 8, s.key, s.val);
                  }}
                />
              );
            });
          })}

          {/* Labels meses */}
          {meses.map((mes, gi) => {
            const baseX = PADDING_L + startX + gi * (groupW + groupGap);
            const center = baseX + groupW / 2;
            return (
              <SvgText
                key={`lbl-${mes}`}
                x={center}
                y={height - 14}
                fontSize="11"
                fill="#292B2F"
                textAnchor="middle"
                fontFamily="Montserrat_400Regular"
              >
                {mes}
              </SvgText>
            );
          })}

          {/* Tooltip */}
          {tip.visible && (
            <>
              <Rect x={tip.x - 34} y={tip.y - 28} width={68} height={22} rx={6} fill="#292B2F" />
              <SvgText
                x={tip.x}
                y={tip.y - 13}
                fontSize="12"
                fill="#fff"
                textAnchor="middle"
                fontWeight="700"
                fontFamily="Montserrat_700Bold"
              >
                {tip.text}
              </SvgText>
            </>
          )}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    textAlign: "center",
    color: "#292B2F",
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#292B2F",
  },
  switchesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  switchItem: { alignItems: "center" },
  switchLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#292B2F",
    marginBottom: 2,
  },
});
