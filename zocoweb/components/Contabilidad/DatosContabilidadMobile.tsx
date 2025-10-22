import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const formaPesos = (numero) => {
  if (!numero) return "$0,00";
  const monto = parseFloat(numero.toString());
  let partes = monto.toFixed(2).split(".");
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${partes[0]},${partes[1]}`;
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
          <Text style={styles.title}>Total bruto</Text>
          <View style={styles.line} />
          <Text style={styles.value}>{formaPesos(totalBrutoMes)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Total neto</Text>
          <View style={styles.line} />
          <Text style={styles.value}>{formaPesos(totalNetoMes)}</Text>
        </View>
      </View>

      {/* Fila 2 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Total de retenciones</Text>
          <View style={styles.line} />
          <Text style={styles.value}>{formaPesos(totalRetencionesMes)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>IVA por comisión</Text>
          <View style={styles.line} />
          <Text style={styles.value}>{formaPesos(totalIvaMes)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 10,
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
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    color: "#444",
  },
  line: {
    height: 1,
    backgroundColor: "#e6e6e6",
    width: "70%",
    alignSelf: "center",
    marginVertical: 8,
  },
  value: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E1E2D",
  },
});

export default DatosContabilidadMobile;
