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

// 🔹 Helper para formatear a pesos
export const formatearAPeso = (valor: number) => {
  if (!valor || isNaN(valor)) return "$0,00";
  const valorFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(valor);
  return valorFormateado.replace("ARS", "").trim();
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
      <View style={styles.grid}>
        {cards.map((c, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <View style={styles.separator} />
            <Text style={styles.cardValue}>{c.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, marginBottom: 8 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 0.8,
    borderColor: "#E3E6EE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#434751",
    textAlign: "center",
    marginBottom: 6,
  },
  separator: {
    width: "70%",
    height: 1,
    backgroundColor: "#DADDE5",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E2D",
    textAlign: "center",
  },
});
