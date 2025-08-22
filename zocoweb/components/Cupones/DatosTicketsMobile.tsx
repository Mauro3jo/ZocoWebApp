// src/components/Cupones/DatosTicketsMobile.tsx
import React from "react";
import { View, Text } from "react-native";

type Props = {
  datosCuponesContext?: {
    totalOperaciones?: number;
    totalBrutoHoy?: number | string;
    contracargo?: number | string;
    retenciones?: number | string;
  } | null;
};

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

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ECECF1",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
          gap: 8,
        }}
      >
        <Row k="Cantidad de Operaciones" v={String(totalOperaciones)} />
        <Row k="Acumulado del Mes" v={formatARS(totalBrutoHoy)} />
        <Row k="Contracargos del Mes" v={formatARS(contracargo)} />
        <Row k="Retenciones más Impuestos" v={formatARS(retenciones)} />
      </View>
    </View>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#E8E9ED",
      borderStyle: "dashed",
    }}
  >
    <Text style={{ fontSize: 13, color: "#686B73", fontWeight: "700" }}>{k}</Text>
    <Text style={{ fontSize: 15, color: "#17181C", fontWeight: "700" }}>{v}</Text>
  </View>
);

export default DatosTicketsMobile;
