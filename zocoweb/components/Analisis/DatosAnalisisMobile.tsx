import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  datosBack?: {
    totalOperaciones?: number;
    totalConDescuentoCuotas0?: number;
    totalConDescuentoCuotas1?: number;
    totalConDescuentoCuotas2?: number;
  } | null;
};

// 🔹 Helpers locales
export const formatearAPeso = (valor: number) => {
  const valorFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor);
  const partes = valorFormateado.split(",");
  partes[0] = partes[0]
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(",");
};

export default function DatosAnalisisMobile({ datosBack }: Props) {
  const {
    totalOperaciones = 0,
    totalConDescuentoCuotas0 = 0,
    totalConDescuentoCuotas1 = 0,
    totalConDescuentoCuotas2 = 0,
  } = datosBack ?? {};

  const cards = useMemo(
    () => [
      {
        title: "Cantidad de Operaciones",
        value: `${totalOperaciones}`,
        money: false,
      },
      {
        title: "Débito",
        value: formatearAPeso(totalConDescuentoCuotas0),
        money: true,
      },
      {
        title: "1 Pago",
        value: formatearAPeso(totalConDescuentoCuotas1),
        money: true,
      },
      {
        title: "Cuotas",
        value: formatearAPeso(totalConDescuentoCuotas2),
        money: true,
      },
    ],
    [
      totalOperaciones,
      totalConDescuentoCuotas0,
      totalConDescuentoCuotas1,
      totalConDescuentoCuotas2,
    ]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Análisis</Text>

      <View style={styles.grid}>
        {cards.map((c, idx) => (
          <View key={idx} style={[styles.card, styles.cardLight]}>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <Text style={styles.cardValue}>
              {c.money ? c.value : c.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#292B2F",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: "#F6F7F9",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#434751",
    textAlign: "center",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#292B2F",
    textAlign: "center",
  },
});
