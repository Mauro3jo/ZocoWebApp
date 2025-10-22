// src/components/Cupones/DatosTicketsMobile.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  datosCuponesContext?: {
    totalOperaciones?: number;
    totalBrutoHoy?: number | string;
    contracargo?: number | string;
    retenciones?: number | string;
  } | null;
};

// 🔹 Formatear a moneda ARS
const formatARS = (v: any) => {
  const n = Number(v);
  if (!isFinite(n)) return "$ 0,00";
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

const DatosTicketsMobile: React.FC<Props> = ({ datosCuponesContext }) => {
  const totalOperaciones = datosCuponesContext?.totalOperaciones ?? 0;
  const totalBrutoHoy = datosCuponesContext?.totalBrutoHoy ?? 0;
  const contracargo = datosCuponesContext?.contracargo ?? 0;
  const retenciones = datosCuponesContext?.retenciones ?? 0;

  const rows = [
    { k: "Cantidad de Operaciones", v: String(totalOperaciones) },
    { k: "Acumulado del Mes", v: formatARS(totalBrutoHoy) },
    { k: "Contracargos del Mes", v: formatARS(contracargo) },
    { k: "Retenciones más Impuestos", v: formatARS(retenciones) },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {rows.map((row, idx) => (
          <View
            key={idx}
            style={[
              styles.row,
              idx === rows.length - 1 && { borderBottomWidth: 0 }, // 🔹 sin línea final
            ]}
          >
            <Text style={styles.label}>{row.k}</Text>
            <Text style={styles.value}>{row.v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECECF1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E5EA",
    borderStyle: "dashed", // 🔹 línea punteada
  },
  label: {
    fontSize: 13,
    color: "#6B6E75",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#1C1D21",
    fontWeight: "700",
  },
});

export default DatosTicketsMobile;
