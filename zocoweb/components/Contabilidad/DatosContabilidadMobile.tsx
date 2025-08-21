import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const formaPesos = (numero) => {
  if (!numero) return "$0,00";
  const monto = parseFloat(numero.toString());
  let partes = monto.toFixed(2).split(".");
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${partes[0]},${partes[1]}`;
};

const DatosContabilidadMobile = ({ datosBack }) => {
  if (!datosBack) return null;

  const {
    totalBrutoMes,
    totalIvaMes,
    totalNetoMes,
    totalRetencionesMes,
  } = datosBack;

  return (
    <View style={styles.container}>
      {/* Fila 1 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Total Bruto{" "}
            <MaterialCommunityIcons
              name="cash-multiple"
              size={16}
              color="#B1C20E"
            />
          </Text>
          <Text style={styles.value}>{formaPesos(totalBrutoMes)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            Total Neto{" "}
            <MaterialCommunityIcons
              name="cash-multiple"
              size={16}
              color="#B1C20E"
            />
          </Text>
          <Text style={styles.value}>{formaPesos(totalNetoMes)}</Text>
        </View>
      </View>

      {/* Fila 2 */}
      <View style={styles.row}>
        <View style={styles.cardLight}>
          <Text style={styles.titleLight}>Total de Retenciones</Text>
          <Text style={styles.valueLight}>
            {formaPesos(totalRetencionesMes)}
          </Text>
        </View>

        <View style={styles.cardLight}>
          <Text style={styles.titleLight}>IVA por Comisión</Text>
          <Text style={styles.valueLight}>{formaPesos(totalIvaMes)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLight: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 6,
    borderWidth: 0.5,
    borderColor: "#eee",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  titleLight: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
    color: "#777",
  },
  value: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E1E2D",
  },
  valueLight: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});

export default DatosContabilidadMobile;
