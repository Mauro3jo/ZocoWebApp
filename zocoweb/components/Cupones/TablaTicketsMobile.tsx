// src/components/Tickets/TablaTicketsMobile.tsx
import React, { ReactNode, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_EXCEL, REACT_APP_API_EXCEL_ANUAL, REACT_APP_API_PDF } from "@env";
import { Feather } from "@expo/vector-icons"; // 🔹 para el icono de descarga
import ItemsTablaTicketMobile from "./ItemsTablaTicketMobile";

/* ===================== Tipos ===================== */
type ItemMes = {
  fecha?: string;
  fechaPago?: string;
  fechaDePago?: string;
  fechaOperacion?: string;
  totalBruto?: number | string;
  bruto?: number | string;
  totalOP?: number | string;
  totalConDescuentos?: number | string;
  tieneDocumentos?: boolean;
};

type Props = {
  listaMes: ItemMes[];
  datos?: { anio?: number; mes?: number; comercio?: string } | null;
  headerComponent?: ReactNode;
  bottomPadding?: number;
};

/* ===================== Helpers ===================== */
const fmtDMY = (input?: string) => {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return input.replaceAll("/", "-");
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${d.getFullYear()}`;
};

const normFecha = (s?: string) => (s ?? "").replaceAll("/", "-").toLowerCase();

const ensureEnv = (value: any, name: string) => {
  if (!value) {
    Alert.alert("Configuración", `Falta definir ${name} en el archivo .env`);
    throw new Error(`Missing ${name}`);
  }
  return value as string;
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  // @ts-ignore
  return global.btoa(binary);
}

/* ===================== Componente principal ===================== */
const TablaTicketsMobile: React.FC<Props> = ({
  listaMes,
  datos,
  headerComponent,
  bottomPadding = 0,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [downloading, setDownloading] = useState<"pdf" | "mes" | "anual" | null>(null);

  const lista = useMemo(() => (Array.isArray(listaMes) ? listaMes : []), [listaMes]);
  const listaFiltrada = useMemo(() => {
    const b = busqueda.trim().toLowerCase();
    if (!b) return lista;
    const needle = b.replaceAll("/", "-");
    return lista.filter((it) => {
      const f = it.fecha ?? it.fechaPago ?? it.fechaDePago ?? it.fechaOperacion ?? "";
      return normFecha(f).includes(needle);
    });
  }, [lista, busqueda]);

  /* ===================== Descargas ===================== */
  const descargarArchivo = async (
    url: string,
    body: any,
    nombreArchivo: string,
    mimeType: string
  ) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No hay token");

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...body }),
    });
    if (!resp.ok) throw new Error(`Error de red: ${resp.status}`);

    const buf = await resp.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    const fileUri = FileSystem.cacheDirectory + nombreArchivo.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri, { mimeType });
    else Alert.alert("Descarga", `Archivo guardado en cache: ${fileUri}`);
  };

  const onDescargarExcelMes = async () => {
    if (downloading) return;
    try {
      setDownloading("mes");
      const hoy = new Date();
      const Year = Number(datos?.anio ?? hoy.getFullYear());
      const Month = Number(datos?.mes ?? hoy.getMonth() + 1);
      const comercio = String(datos?.comercio ?? "Todos");

      await descargarArchivo(
        ensureEnv(REACT_APP_API_EXCEL, "REACT_APP_API_EXCEL"),
        { Year, Month, comercio },
        `reporte_Zoco_${comercio}_${Year}-${Month}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (e: any) {
      Alert.alert("Excel", e?.message ?? "No se pudo descargar el Excel.");
    } finally {
      setDownloading(null);
    }
  };

  const onDescargarExcelAnual = async () => {
    if (downloading) return;
    try {
      setDownloading("anual");
      const hoy = new Date();
      const Year = Number(datos?.anio ?? hoy.getFullYear());
      const comercio = String(datos?.comercio ?? "Todos");

      await descargarArchivo(
        ensureEnv(REACT_APP_API_EXCEL_ANUAL, "REACT_APP_API_EXCEL_ANUAL"),
        { Year, comercio },
        `reporte_anual_Zoco_${comercio}_${Year}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (e: any) {
      Alert.alert("Excel Anual", e?.message ?? "No se pudo descargar el Excel Anual.");
    } finally {
      setDownloading(null);
    }
  };

  const onDescargarPdfMes = async () => {
    if (downloading) return;
    try {
      setDownloading("pdf");
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      const hoy = new Date();
      const Year = Number(datos?.anio ?? hoy.getFullYear());
      const Month = Number(datos?.mes ?? hoy.getMonth() + 1);
      const comercio = String(datos?.comercio ?? "Todos");

      const resp = await fetch(ensureEnv(REACT_APP_API_PDF, "REACT_APP_API_PDF"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, Year, Month, comercio }),
      });
      if (!resp.ok) throw new Error(`Error de red: ${resp.status}`);
      const json = await resp.json();
      console.log("PDF generado", json);
    } catch (e: any) {
      Alert.alert("PDF", e?.message ?? "No se pudo generar el PDF.");
    } finally {
      setDownloading(null);
    }
  };

  /* ===================== Encabezado de tabla ===================== */
  const TableHeader = (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F5F6FA",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E2E3E8",
      }}
    >
      <CellHeader text="Fecha de pago" />
      <CellHeader text="Bruto" />
      <CellHeader text="TOTAL" highlight />
      <CellHeader text="Orden de pago" />
    </View>
  );

  /* ===================== Botones finos ===================== */
  const Tiles = (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <DownloadButton
        label="Descargar PDF"
        onPress={onDescargarPdfMes}
        loading={downloading === "pdf"}
      />
      <DownloadButton
        label="Descargar Excel"
        onPress={onDescargarExcelMes}
        loading={downloading === "mes"}
      />
      <DownloadButton
        label="Descargar Anual"
        onPress={onDescargarExcelAnual}
        loading={downloading === "anual"}
      />
    </View>
  );

  /* ===================== Render principal ===================== */
  return (
    <FlatList
      data={listaFiltrada}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={
        <View style={{ gap: 14, paddingHorizontal: 20, paddingTop: 20 }}>
          {headerComponent}

          {/* Buscador */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>Buscar por fecha:</Text>
            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Ej: 01-01-2024"
              inputMode="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#D6D7DB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: "#fff",
                fontSize: 15,
                color: "#101114",
              }}
              placeholderTextColor="#9aa0a6"
            />
          </View>

          {/* Botones finos */}
          {Tiles}

          {/* Encabezado Tabla */}
          {TableHeader}
        </View>
      }
      renderItem={({ item }) => {
        const fechaRaw =
          item.fecha ?? item.fechaPago ?? item.fechaDePago ?? item.fechaOperacion ?? "";
        const bruto = item.totalBruto ?? item.bruto ?? 0;
        const total = item.totalOP ?? item.totalConDescuentos ?? 0;

        return (
          <View style={{ paddingHorizontal: 20 }}>
            <ItemsTablaTicketMobile
              fechaDisplay={fmtDMY(fechaRaw)}
              fechaApiRaw={fechaRaw}
              bruto={bruto}
              total={total}
              tieneDocumentos={item.tieneDocumentos}
            />
          </View>
        );
      }}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    />
  );
};

/* ===================== Subcomponentes ===================== */
const CellHeader = ({ text }: { text: string }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#F5F6FA", // ✅ todos los headers del mismo color
      paddingVertical: 8,
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: "#E0E0E0",
    }}
  >
    <Text
      style={{
        color: "#1C1C1C",
        fontWeight: "700",
        fontSize: 12,
        textAlign: "center",
      }}
    >
      {text}
    </Text>
  </View>
);

const DownloadButton = ({
  label,
  onPress,
  loading,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={{
      flex: 1,
      backgroundColor: "#B4C400",
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 4,
    }}
  >
    {loading ? (
      <ActivityIndicator color="#111" />
    ) : (
      <>
        <Feather name="download" size={18} color="#111" />
        <Text style={{ fontWeight: "700", fontSize: 13, color: "#111" }}>{label}</Text>
      </>
    )}
  </TouchableOpacity>
);

export default TablaTicketsMobile;
