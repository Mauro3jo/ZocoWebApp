import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Helper interno
const formatearAPeso = (valor?: number) => {
  if (!valor) return "$0,00";
  const valorFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(valor);

  const partes = valorFormateado.split(",");
  partes[0] = partes[0]
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${partes.join(",")}`;
};

const formatearValores = (...valores: number[]) => {
  return valores.map((valor) => formatearAPeso(valor));
};

type Props = {
  datosBack?: {
    totalBrutoMes: number;
    totaldebito: number;
    arancel: number;
    totalIva21Mes: number;
    ingresobruto: number;
    retencionganancia: number;
    retecionIva: number;
    totalOperaciones: string;
  };
};

export default function ImpuestosCardsMobile({ datosBack }: Props) {
  if (!datosBack) return null;

  const {
    totalBrutoMes,
    totaldebito,
    arancel,
    totalIva21Mes,
    ingresobruto,
    retencionganancia,
    retecionIva,
    totalOperaciones,
  } = datosBack;

  const valoresFormateados = formatearValores(
    totalBrutoMes,
    totaldebito,
    arancel,
    totalIva21Mes,
    ingresobruto,
    retencionganancia,
    retecionIva
  );

  return (
    <View style={styles.container}>
      {/* IVA */}
      <View style={styles.cardFlat}>
        <Text style={styles.cardTitle}>IVA</Text>

        {/* Ventas */}
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.label}>Base imponible</Text>
            <Text style={styles.value}>{valoresFormateados[0]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IVA débito fiscal</Text>
            <Text style={styles.value}>{valoresFormateados[1]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total ventas</Text>
            <Text style={styles.value}>{totalOperaciones}</Text>
          </View>
        </View>

        {/* Compras */}
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.label}>Base imponible</Text>
            <Text style={styles.value}>{valoresFormateados[2]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IVA débito fiscal</Text>
            <Text style={styles.value}>{valoresFormateados[3]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total ventas</Text>
            <Text style={styles.value}>{totalOperaciones}</Text>
          </View>
        </View>

        <Text style={styles.retencionText}>
          Total ret. IVA {valoresFormateados[6]}
        </Text>
      </View>

      {/* IIBB + Ret. de ganancias */}
      <View style={styles.rowSplitContainer}>
        <View style={styles.halfCard}>
          <Text style={styles.splitTitle}>IIBB</Text>
          <Text style={styles.subLabel}>TOTAL</Text>
          <Text style={styles.splitValue}>{valoresFormateados[4]}</Text>
        </View>

        <View style={styles.halfCard}>
          <Text style={styles.splitTitle}>Ret. de ganancias</Text>
          <Text style={styles.subLabel}>TOTAL</Text>
          <Text style={styles.splitValue}>{valoresFormateados[5]}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  // 🔹 Tarjeta IVA principal
  cardFlat: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E3E6EE",
  },
  cardTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#141517",
    fontFamily: "Montserrat_700Bold",
  },
  block: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Montserrat_400Regular",
  },
  value: {
    fontSize: 14,
    color: "#1E1E2D",
    fontFamily: "Montserrat_600SemiBold",
  },
  retencionText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#1E1E2D",
    fontFamily: "Montserrat_700Bold",
  },

  // 🔹 Bloque inferior doble
  rowSplitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfCard: {
    flexBasis: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3E6EE",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  splitTitle: {
    fontSize: 15,
    color: "#141517",
    marginBottom: 6,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  subLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  splitValue: {
    fontSize: 16,
    color: "#1E1E2D",
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
});
