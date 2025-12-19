import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_PDF_ANDROID_ORDENPAGO } from "@env";

const fmtARS = (v: any) => {
  const n = Number(v);
  if (!isFinite(n)) return "$ 0,00";
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

// 🔥 LÓGICA IDÉNTICA A TU VERSIÓN WEB PARA FORMATEAR FECHA
const formatearFechaParaDisplay = (fecha: string) => {
  if (!fecha) return "-";
  // Intentamos crear objeto Date
  const fechaObj = new Date(fecha);

  // Si es inválida (pasa mucho con fechas string "dd-MM-yyyy" directas en JS)
  if (isNaN(fechaObj.getTime())) {
     // Si ya viene formateada tipo "20-05-2024", la devolvemos tal cual o parseamos manual
     return fecha.split("T")[0]; // Quitamos hora si la tiene
  }

  const dia = String(fechaObj.getDate()).padStart(2, "0");
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0"); // Mes arranca en 0
  const anio = fechaObj.getFullYear();

  return `${dia}-${mes}-${anio}`;
};

// 🔥 PARA EL BACKEND SIEMPRE DD-MM-YYYY
const parsearFechaParaBackend = (fecha: string) => {
    // Reutilizamos la lógica de display pero asegurando guiones
    const display = formatearFechaParaDisplay(fecha);
    return display.replace(/\//g, "-"); // Aseguramos guiones por si acaso
};

type Props = {
  fechaDisplay: string; // Puede venir "2024-05-20T00:00:00"
  fechaApiRaw: string;
  bruto: number | string;
  total: number | string;
  tieneDocumentos?: boolean;
};

const ItemsTablaTicketMobile: React.FC<Props> = ({
  fechaDisplay, // En tu componente padre le pasas: item.fechaPago ?? item.fecha
  bruto,
  total,
  tieneDocumentos,
}) => {
  const [downloading, setDownloading] = useState(false);

  // Parseamos la fecha para mostrar en la fila (Igual que en la Web)
  const fechaVisual = formatearFechaParaDisplay(fechaDisplay);

  const descargarOrdenesPorFecha = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      // Preparamos fecha para API (dd-MM-yyyy)
      const fechaParaApi = parsearFechaParaBackend(fechaDisplay);

      const url = REACT_APP_API_PDF_ANDROID_ORDENPAGO;
      if (!url) throw new Error("Falta API en .env");

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token,
            FechaPago: fechaParaApi,
            comercio: "Todos"
        }),
      });

      if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Error ${resp.status}: ${text}`);
      }

      const docs = await resp.json();

      if (!Array.isArray(docs) || docs.length === 0) {
        Alert.alert("Aviso", "No hay documentos para esta fecha.");
        return;
      }

      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const b64 = String(doc?.pdfBase64 ?? "");

        if (!b64) continue;

        const nombre = String(doc?.archivo ?? `OrdenPago-${i + 1}.pdf`);
        const safeName = nombre.replace(/[^a-zA-Z0-9.\-_]/g, "_");

        const fileUri = FileSystem.cacheDirectory + safeName;

        await FileSystem.writeAsStringAsync(fileUri, b64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
              mimeType: "application/pdf",
              dialogTitle: "Orden de Pago"
          });
        }
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", "No se pudo descargar.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ECECF1",
        paddingVertical: 10,
      }}
    >
      {/* 🔹 FECHA PARSEADA VISUALMENTE */}
      <Cell style={{ flex: 1 }}>
        <Text style={cellText}>{fechaVisual}</Text>
      </Cell>

      {/* Bruto */}
      <Cell style={{ flex: 1 }}>
        <Text
          style={[cellText, rightNum, { fontFamily: "Montserrat_600SemiBold" }]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {fmtARS(bruto)}
        </Text>
      </Cell>

      {/* Total */}
      <Cell style={{ flex: 1.2 }}>
        <Text
          style={[
            cellText,
            rightNum,
            { fontFamily: "Montserrat_700Bold" },
          ]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {fmtARS(total)}
        </Text>
      </Cell>

      {/* Botón */}
      <Cell style={{ flex: 1 }}>
        {tieneDocumentos === false ? (
          <Text
            style={{
              fontSize: 11,
              color: "#8a8d96",
              textAlign: "center",
              fontFamily: "Montserrat_600SemiBold",
            }}
            allowFontScaling={false}
          >
            Sin docs
          </Text>
        ) : (
          <TouchableOpacity
            onPress={descargarOrdenesPorFecha}
            disabled={downloading}
            style={{
              alignItems: "center",
              justifyContent: "center",
              minWidth: 80,
              height: 32,
            }}
            activeOpacity={0.7}
          >
            {downloading ? (
              <ActivityIndicator color="#B1C20E" size="small" />
            ) : (
              <Text
                style={{
                  color: "#B1C20E",
                  fontSize: 12,
                  fontFamily: "Montserrat_700Bold",
                  textAlign: "center",
                  includeFontPadding: false,
                }}
                allowFontScaling={false}
              >
                Descargar
              </Text>
            )}
          </TouchableOpacity>
        )}
      </Cell>
    </View>
  );
};

// Estilos y celdas...
const Cell = ({ children, style }: { children: React.ReactNode; style?: any }) =>
  <View style={[{ paddingHorizontal: 8 }, style]}>{children}</View>;

const cellText = {
  fontSize: 12,
  color: "#111",
  fontFamily: "Montserrat_600SemiBold",
};

const rightNum = {
  textAlign: "right" as const,
  includeFontPadding: false,
};

export default ItemsTablaTicketMobile;