import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Helper interno
const formatearAPeso = (valor) => {
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

const formatearValores = (...valores) => {
  return valores.map((valor) => formatearAPeso(valor));
};

export default function ImpuestosCardsMobile({ datosBack }) {
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
  cardFlat: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
  },
  block: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  retencionText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E2D",
  },
  rowSplitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfCard: {
    flexBasis: "48.5%", // ✅ asegura mismo tamaño en todos los dispositivos
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ececec",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  splitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  splitValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E2D",
  },
});
