import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg";

type CuotaItem = { cuota: number; totalBruto: number };
type Props = {
  datosBack?: {
    debitoFacturacion?: number;
    creditoFacturacion?: number;
    debito?: number;
    credito?: number;
    cuotas?: CuotaItem[];
  } | null;
};

const GREEN = "#B4C400";
const BLACK = "#B1B1B1"; // 🔹 reemplazo del negro por gris claro, mantiene el nombre
const GRID = "#E9EDF3";

// ===== helpers =====
const formatearAPeso = (valor: number) => {
  const valorFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor);
  const partes = valorFormateado.split(",");
  partes[0] = partes[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(",");
};
const scale = (v: number, vmax: number, pxMax: number) =>
  vmax > 0 ? Math.max(0, Math.min(pxMax, (v / vmax) * pxMax)) : 0;

/** ====== CARD DOBLE ====== */
function DualBarsCard({
  leftTitle,
  rightTitle,
  leftValues,
  rightValues,
  labels = ["Débito", "Crédito"],
  isMoney = true,
}: {
  leftTitle: string;
  rightTitle: string;
  leftValues: [number, number];
  rightValues: [number, number];
  labels?: [string, string];
  isMoney?: boolean;
}) {
  const width = Dimensions.get("window").width - 32;
  const height = 240;

  const PAD_L = 16;
  const PAD_R = 16;
  const PAD_T = 28;
  const PAD_B = 48;

  const chartW = width - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const midX = PAD_L + chartW / 2;

  const vmaxL = Math.max(1, ...leftValues);
  const vmaxR = Math.max(1, ...rightValues);

  const barW = 34;
  const gap = 40;

  const leftStart = PAD_L + (chartW / 2 - (barW * 2 + gap)) / 2;
  const rightStart = midX + (chartW / 2 - (barW * 2 + gap)) / 2;

  const [tip, setTip] = useState<{ x: number; y: number; text: string; show: boolean }>({
    x: 0,
    y: 0,
    text: "",
    show: false,
  });

  const renderPair = (
    values: [number, number],
    startX: number,
    vmax: number,
    colors: [string, string]
  ) =>
    [0, 1].map((i) => {
      const v = values[i] ?? 0;
      const h = scale(v, vmax, chartH);
      const x = startX + i * (barW + gap);
      const y = PAD_T + (chartH - h);
      return (
        <Rect
          key={`bar-${startX}-${i}`}
          x={x}
          y={y}
          width={barW}
          height={h}
          rx={8}
          fill={colors[i]}
          onPress={(e: any) => {
            const { locationX, locationY } = e.nativeEvent;
            setTip({
              x: PAD_L + locationX,
              y: PAD_T + locationY - 10,
              text: isMoney ? formatearAPeso(v) : String(v),
              show: true,
            });
            setTimeout(() => setTip((t) => ({ ...t, show: false })), 1200);
          }}
        />
      );
    });

  return (
    <View style={styles.card}>
      <View style={{ position: "relative" }}>
        <Svg width={width} height={height}>
          {/* títulos arriba (izq/der) */}
          <SvgText
            x={PAD_L + 6}
            y={18}
            fontSize="14"
            fill="#5F6470"
            fontWeight="600"
            fontFamily="Montserrat_700Bold"
          >
            {leftTitle}
          </SvgText>
          <SvgText
            x={midX + 6}
            y={18}
            fontSize="14"
            fill="#5F6470"
            fontWeight="600"
            fontFamily="Montserrat_700Bold"
          >
            {rightTitle}
          </SvgText>

          {/* baseline gris */}
          <Line
            x1={PAD_L}
            y1={PAD_T + chartH}
            x2={width - PAD_R}
            y2={PAD_T + chartH}
            stroke={GRID}
            strokeWidth={2}
          />

          {/* divisor vertical */}
          <Line
            x1={midX}
            y1={PAD_T - 8}
            x2={midX}
            y2={PAD_T + chartH + 10}
            stroke={GRID}
            strokeWidth={2}
          />

          {/* barras: Débito gris / Crédito verde */}
          {renderPair(leftValues, leftStart, vmaxL, [BLACK, GREEN])}
          {renderPair(rightValues, rightStart, vmaxR, [BLACK, GREEN])}

          {/* labels de cada lado */}
          {[0, 1].map((i) => {
            const x = leftStart + i * (barW + gap) + barW / 2;
            return (
              <SvgText
                key={`ll-${i}`}
                x={x}
                y={height - 16}
                fontSize="12"
                fill="#292B2F"
                textAnchor="middle"
                fontFamily="Montserrat_400Regular"
              >
                {labels[i]}
              </SvgText>
            );
          })}
          {[0, 1].map((i) => {
            const x = rightStart + i * (barW + gap) + barW / 2;
            return (
              <SvgText
                key={`lr-${i}`}
                x={x}
                y={height - 16}
                fontSize="12"
                fill="#292B2F"
                textAnchor="middle"
                fontFamily="Montserrat_400Regular"
              >
                {labels[i]}
              </SvgText>
            );
          })}

          {/* tooltip */}
          {tip.show && (
            <>
              <Rect x={tip.x - 40} y={tip.y - 26} width={80} height={22} rx={6} fill="#292B2F" />
              <SvgText
                x={tip.x}
                y={tip.y - 11}
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

/** ====== BARRAS DE CUOTAS ====== */
function CuotasCard({ title, cuotas }: { title: string; cuotas: CuotaItem[] }) {
  const width = Dimensions.get("window").width - 32;
  const height = 220;

  const PAD_L = 8;
  const PAD_R = 8;
  const PAD_T = 16;
  const PAD_B = 44;

  const datos = useMemo(() => {
    const clean = (cuotas ?? []).filter((c) => c.cuota !== 0);
    clean.sort((a, b) => a.cuota - b.cuota);
    return clean;
  }, [cuotas]);

  const labels = datos.map((c) => String(c.cuota));
  const values = datos.map((c) => c.totalBruto ?? 0);

  const chartW = width - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const vmax = Math.max(1, ...values);

  const minBarW = 18;
  const maxBarW = 28;
  const gap = Math.max(8, Math.floor(chartW * 0.015));

  let barW = Math.floor((chartW - (values.length - 1) * gap) / values.length);
  if (barW > maxBarW) barW = maxBarW;
  if (barW < minBarW) barW = minBarW;

  const totalW = values.length * barW + (values.length - 1) * gap;
  const startX = PAD_L + Math.max(0, (chartW - totalW) / 2);

  const [tip, setTip] = useState<{ x: number; y: number; text: string; show: boolean }>({
    x: 0,
    y: 0,
    text: "",
    show: false,
  });

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={{ position: "relative" }}>
        <Svg width={width} height={height}>
          <Line
            x1={PAD_L}
            y1={PAD_T + chartH}
            x2={width - PAD_R}
            y2={PAD_T + chartH}
            stroke={GRID}
            strokeWidth={2}
          />
          {values.map((v, i) => {
            const h = scale(v, vmax, chartH);
            const x = startX + i * (barW + gap);
            const y = PAD_T + (chartH - h);
            return (
              <Rect
                key={`bar-${i}`}
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={6}
                fill={GREEN}
                onPress={(e: any) => {
                  const { locationX, locationY } = e.nativeEvent;
                  setTip({
                    x: PAD_L + locationX,
                    y: PAD_T + locationY - 8,
                    text: formatearAPeso(v),
                    show: true,
                  });
                  setTimeout(() => setTip((t) => ({ ...t, show: false })), 1200);
                }}
              />
            );
          })}
          {labels.map((lbl, i) => {
            const x = startX + i * (barW + gap) + barW / 2;
            return (
              <SvgText
                key={`lbl-${i}`}
                x={x}
                y={height - 14}
                fontSize="11"
                fill="#292B2F"
                textAnchor="middle"
                fontFamily="Montserrat_400Regular"
              >
                {lbl}
              </SvgText>
            );
          })}
          {tip.show && (
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

/** ====== CONTENEDOR PRINCIPAL ====== */
export default function TripleGraficoAnalisisMobile({ datosBack }: Props) {
  const debitoFacturacion = datosBack?.debitoFacturacion ?? 0;
  const creditoFacturacion = datosBack?.creditoFacturacion ?? 0;

  const debito = datosBack?.debito ?? 0;
  const credito = datosBack?.credito ?? 0;

  const cuotas = datosBack?.cuotas ?? [];

  return (
    <View style={styles.wrapper}>
      <DualBarsCard
        leftTitle="Ventas por tipo de pago"
        rightTitle="Ticket promedio"
        leftValues={[debitoFacturacion, creditoFacturacion]}
        rightValues={[debito, credito]}
        labels={["Débito", "Crédito"]}
        isMoney
      />

      <CuotasCard title="Facturación por tipo de cuota" cuotas={cuotas} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#292B2F",
    marginBottom: 8,
  },
});
