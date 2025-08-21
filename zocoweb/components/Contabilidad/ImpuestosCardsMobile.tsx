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
  return `$ ${partes.join(",")}`;
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>IVA</Text>

        {/* Ventas */}
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.label}>Base imponible</Text>
            <Text style={styles.value}>{valoresFormateados[0]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IVA Débito fiscal</Text>
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
            <Text style={styles.label}>IVA Crédito fiscal</Text>
            <Text style={styles.value}>{valoresFormateados[3]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total ventas</Text>
            <Text style={styles.value}>{totalOperaciones}</Text>
          </View>
        </View>

        {/* Total Retenciones IVA */}
        <Text style={styles.retencionText}>
          Total Ret. IVA {valoresFormateados[6]}
        </Text>
      </View>

      {/* IIBB + Retención Ganancias */}
      <View style={styles.card}>
        <View style={styles.rowSplit}>
          {/* IIBB */}
          <View style={styles.splitBlock}>
            <Text style={styles.splitTitle}>IIBB</Text>
            <Text style={styles.label}>TOTAL</Text>
            <Text style={styles.value}>{valoresFormateados[4]}</Text>
          </View>

          <View style={styles.divider} />

          {/* Retención Ganancias */}
          <View style={styles.splitBlock}>
            <Text style={styles.splitTitle}>Retención de ganancias</Text>
            <Text style={styles.label}>TOTAL</Text>
            <Text style={styles.value}>{valoresFormateados[5]}</Text>
          </View>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E2D",
    textAlign: "center",
    marginBottom: 12,
  },
  block: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#8C91A5",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#30313A",
  },
  retencionText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#1E1E2D",
  },
  rowSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  splitBlock: {
    flex: 1,
    alignItems: "center",
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1E1E2D",
    textAlign: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
});
