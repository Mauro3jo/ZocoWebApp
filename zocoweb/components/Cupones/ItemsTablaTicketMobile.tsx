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
import { REACT_APP_API_PDF_ALIADO } from "@env";

const fmtARS = (v: any) => {
  const n = Number(v);
  if (!isFinite(n)) return "$ 0,00";
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

// 🔹 Convierte fecha a dd/MM/yyyy
const toSlashDMY = (input?: string) => {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    return input.replaceAll("-", "/");
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

type Props = {
  fechaDisplay: string;
  fechaApiRaw: string;
  bruto: number | string;
  total: number | string;
  tieneDocumentos?: boolean;
};

const ItemsTablaTicketMobile: React.FC<Props> = ({
  fechaDisplay,
  fechaApiRaw,
  bruto,
  total,
  tieneDocumentos,
}) => {
  const [downloading, setDownloading] = useState(false);

  const descargarOrdenesPorFecha = async () => {
    if (downloading) return;
    try {
      setDownloading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      const fecha = toSlashDMY(fechaApiRaw);
      const url = REACT_APP_API_PDF_ALIADO;
      if (!url) throw new Error("Falta REACT_APP_API_PDF_ALIADO en .env");

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fecha }),
      });
      if (!resp.ok) throw new Error(`Error de red: ${resp.status}`);

      const docs = await resp.json();
      if (!Array.isArray(docs) || docs.length === 0) {
        Alert.alert("Descarga", "No hay documentos para esa fecha.");
        return;
      }

      // 🔹 Guardar y compartir cada PDF
      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const b64 = String(doc?.documentoPdfBase64 ?? "");
        if (!b64) continue;

        const nombre = String(doc?.nombreDocumento ?? `Orden-Pago-${i + 1}`);
        const safeName = `${nombre}-${fechaDisplay}.pdf`.replace(
          /[^a-zA-Z0-9.\-_]/g,
          "_"
        );
        const fileUri = FileSystem.cacheDirectory + safeName;

        await FileSystem.writeAsStringAsync(fileUri, b64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, { mimeType: "application/pdf" });
        }
      }
    } catch (e: any) {
      Alert.alert("Orden de Pago", e?.message ?? "No se pudo descargar el PDF.");
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
      {/* Fecha */}
      <Cell style={{ flex: 1 }}>
        <Text style={cellText}>{fechaDisplay}</Text>
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

      {/* Orden de Pago */}
      <Cell style={{ flex: 1 }}>
        {tieneDocumentos === false ? (
          <Text
            style={{
              fontSize: 11,
              color: "#8a8d96",
              textAlign: "center",
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            Sin docs
          </Text>
        ) : (
          <TouchableOpacity
            onPress={descargarOrdenesPorFecha}
            disabled={downloading}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {downloading ? (
              <ActivityIndicator color="#B1C20E" size="small" />
            ) : (
              <Text
                style={{
                  color: "#B1C20E",
                  fontSize: 12,
                  fontFamily: "Montserrat_700Bold",
                }}
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

// 🔹 Subcomponente de celda
const Cell = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <View style={[{ paddingHorizontal: 8 }, style]}>{children}</View>;

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
