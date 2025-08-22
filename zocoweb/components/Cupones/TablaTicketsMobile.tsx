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
import {
  REACT_APP_API_EXCEL,
  REACT_APP_API_EXCEL_ANUAL,
  REACT_APP_API_PDF,
} from "@env";

import ItemsTablaTicketMobile from "./ItemsTablaTicketMobile";

/** Tipos */
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

/** Helpers */
const fmtDMY = (input?: string) => {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    // si viene dd/MM/yyyy lo dejamos con guiones
    return input.replaceAll("/", "-");
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}-${mm}-${yy}`;
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
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as any);
  }
  // @ts-ignore
  return global.btoa(binary);
}

/** Componente */
const TablaTicketsMobile: React.FC<Props> = ({
  listaMes,
  datos,
  headerComponent,
  bottomPadding = 0,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [downloading, setDownloading] = useState<"pdf" | "mes" | "anual" | null>(null);

  const lista = useMemo(() => Array.isArray(listaMes) ? listaMes : [], [listaMes]);

  const listaFiltrada = useMemo(() => {
    const b = busqueda.trim().toLowerCase();
    if (!b) return lista;
    const needle = b.replaceAll("/", "-");
    return lista.filter((it) => {
      const f = it.fecha ?? it.fechaPago ?? it.fechaDePago ?? it.fechaOperacion ?? "";
      return normFecha(f).includes(needle);
    });
  }, [lista, busqueda]);

  /** ===== Descargas superiores (Expo) ===== */
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

    const safeName = nombreArchivo.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileUri = FileSystem.cacheDirectory + safeName;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType });
    } else {
      Alert.alert("Descarga", `Archivo guardado en cache: ${fileUri}`);
    }
  };

  const onDescargarExcelMes = async () => {
    if (downloading) return;
    try {
      setDownloading("mes");
      const hoy = new Date();
      const Year = Number(datos?.anio ?? hoy.getFullYear());
      const Month = Number(datos?.mes ?? hoy.getMonth() + 1);
      const comercio = String(datos?.comercio ?? "Todos");
      const comercioSafe = comercio.replace(/[^a-zA-Z0-9]/g, "_");

      await descargarArchivo(
        ensureEnv(REACT_APP_API_EXCEL, "REACT_APP_API_EXCEL"),
        { Year, Month, comercio },
        `reporte_Zoco_${comercioSafe}_${Year}-${Month}.xlsx`,
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
      const comercioSafe = comercio.replace(/[^a-zA-Z0-9]/g, "_");

      await descargarArchivo(
        ensureEnv(REACT_APP_API_EXCEL_ANUAL, "REACT_APP_API_EXCEL_ANUAL"),
        { Year, comercio },
        `reporte_anual_Zoco_${comercioSafe}_${Year}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (e: any) {
      Alert.alert("Excel Anual", e?.message ?? "No se pudo descargar el Excel Anual.");
    } finally {
      setDownloading(null);
    }
  };

  // PDF mensual: el back devuelve JSON (datos/sumas). Genero PDF con expo-print dinámico.
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
      const json = await resp.json(); // { datos, sumas, cuit }

      const filas: any[] = json?.datos ?? [];
      const sumas: any = json?.sumas ?? {};
      const cuit: string = json?.cuit ?? "";

      const filaHtml = filas
        .map(
          (it) => `
          <tr>
            <td>${it?.terminal ?? ""}</td>
            <td>${it?.nroOperacion ?? ""}</td>
            <td>${it?.fechaOperacion ?? ""}</td>
            <td>${it?.fechaPago ?? ""}</td>
            <td>${it?.nroCupon ?? ""}</td>
            <td>${it?.nroTarjeta ?? ""}</td>
            <td>${it?.tarjeta ?? ""}</td>
            <td style="text-align:right">${it?.cuotas ?? ""}</td>
            <td style="text-align:right">$ ${it?.bruto ?? 0}</td>
            <td style="text-align:right">$ ${it?.costoFinancieroEn ?? 0}</td>
            <td style="text-align:right">$ ${it?.costoPorAnticipo ?? 0}</td>
            <td style="text-align:right">$ ${it?.arancel ?? 0}</td>
            <td style="text-align:right">$ ${it?.ivaArancel ?? 0}</td>
            <td style="text-align:right">$ ${it?.impDebitoCredito ?? 0}</td>
            <td style="text-align:right">$ ${it?.retencionIIBB ?? 0}</td>
            <td style="text-align:right">$ ${it?.retencionGanancia ?? 0}</td>
            <td style="text-align:right">$ ${it?.retencionIVA ?? 0}</td>
            <td style="text-align:right">$ ${it?.totalOP ?? 0}</td>
          </tr>`
        )
        .join("");

      const html = `
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, Roboto, Arial, sans-serif; }
            h1 { font-size: 18px; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th, td { border: 1px solid #ddd; padding: 4px; }
            th { background:#f2f2f2; }
            .sumas { margin-top: 12px; width: 60%; }
            .sumas td { border: 1px solid #ddd; padding: 4px; }
          </style>
        </head>
        <body>
          <h1>Detalle de Operaciones ${Month}/${Year} • CUIT/CUIL Nº ${cuit}</h1>
          <table class="sumas">
            <tr><td>Bruto</td><td>$ ${sumas?.bruto ?? 0}</td></tr>
            <tr><td>Costo Fin.</td><td>$ ${sumas?.costoFinancieroEn ?? 0}</td></tr>
            <tr><td>Costo Ant</td><td>$ ${sumas?.costoPorAnticipo ?? 0}</td></tr>
            <tr><td>Arancel</td><td>$ ${sumas?.arancel ?? 0}</td></tr>
            <tr><td>IVA Arancel</td><td>$ ${sumas?.ivaArancel ?? 0}</td></tr>
            <tr><td>Cost. transc.</td><td>$ ${sumas?.impDebitoCredito ?? 0}</td></tr>
            <tr><td>Reten. IIBB</td><td>$ ${sumas?.retencionIIBB ?? 0}</td></tr>
            <tr><td>Ret. Ganancia</td><td>$ ${sumas?.retencionGanancia ?? 0}</td></tr>
            <tr><td>Ret. IVA</td><td>$ ${sumas?.retencionIVA ?? 0}</td></tr>
            <tr><td>Total OP</td><td>$ ${sumas?.totalOP ?? 0}</td></tr>
          </table>

          <table style="margin-top:16px">
            <thead>
              <tr>
                <th>TERMINAL</th><th>N OP</th><th>Fecha OP</th><th>Fecha Pago</th>
                <th>N Cupón</th><th>N Tarjeta</th><th>Tarjeta</th><th>Cuotas</th>
                <th>Bruto</th><th>Costo Fin.</th><th>Costo Ant</th><th>Arancel</th>
                <th>IVA Arancel</th><th>Cost. transc.</th><th>Reten. IIBB</th>
                <th>Ret. Ganancia</th><th>Ret. IVA</th><th>Total OP</th>
              </tr>
            </thead>
            <tbody>${filaHtml}</tbody>
          </table>
        </body>
        </html>
      `;

      // import dinámico (evita error si no está instalado en build previas)
      let printToFileAsync: ((opts: { html: string }) => Promise<{ uri: string }>) | null = null;
      try {
        const Print = await import("expo-print");
        printToFileAsync = Print.printToFileAsync;
      } catch {
        Alert.alert("PDF", "Falta instalar 'expo-print'. Ejecutá: npx expo install expo-print");
        return;
      }

      const { uri } = await printToFileAsync!({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
      } else {
        Alert.alert("PDF", `Archivo generado: ${uri}`);
      }
    } catch (e: any) {
      Alert.alert("PDF", e?.message ?? "No se pudo generar el PDF.");
    } finally {
      setDownloading(null);
    }
  };

  /** ===== Header visual de la TABLA ===== */
  const TableHeader = (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1f2937",
        borderRadius: 14,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1f2937",
      }}
    >
      <CellHeader style={{ flex: 1 }} text="Fecha de pago" />
      <CellHeader style={{ flex: 1 }} text="Bruto" />
      <CellHeader style={{ flex: 1.2, backgroundColor: "#B4C400" }} text="TOTAL" color="#111" />
      <CellHeader style={{ flex: 1 }} text="Orden de Pago" />
    </View>
  );

  /** ===== Botones superiores tipo tarjeta ===== */
  const Tiles = (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <ActionTile
        labelTop="PDF"
        labelBottom="Descargar PDF"
        onPress={onDescargarPdfMes}
        loading={downloading === "pdf"}
      />
      <ActionTile
        labelTop="XLS"
        labelBottom="Descargar Excel"
        onPress={onDescargarExcelMes}
        loading={downloading === "mes"}
      />
      <ActionTile
        labelTop="XLS"
        labelBottom="Excel Anual"
        onPress={onDescargarExcelAnual}
        loading={downloading === "anual"}
      />
    </View>
  );

  return (
    <FlatList
      data={listaFiltrada}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={
        <View style={{ gap: 14, paddingHorizontal: 20, paddingTop: 20 }}>
          {headerComponent}

          {/* Buscador */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>Buscar por fecha</Text>
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
                fontSize: 16,
                color: "#101114",
              }}
              placeholderTextColor="#9aa0a6"
            />
          </View>

          {/* Botones */}
          {Tiles}

          {/* Encabezado Tabla */}
          {TableHeader}
        </View>
      }
      ListEmptyComponent={
        <Text style={{ textAlign: "center", color: "#6E7179", marginTop: 8 }}>
          No se encontraron resultados para esta fecha.
        </Text>
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

const CellHeader = ({
  text,
  style,
  color = "#fff",
}: {
  text: string;
  style?: any;
  color?: string;
}) => (
  <View
    style={[
      {
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
      },
      style,
    ]}
  >
    <Text style={{ color, fontWeight: "800", fontSize: 12, textAlign: "center" }}>
      {text}
    </Text>
  </View>
);

const ActionTile = ({
  labelTop,
  labelBottom,
  onPress,
  loading,
}: {
  labelTop: string;
  labelBottom: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={{
      flex: 1,
      backgroundColor: "#B4C400",
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {loading ? (
      <ActivityIndicator />
    ) : (
      <>
        <Text style={{ fontWeight: "900", fontSize: 18, color: "#fff", marginBottom: 6 }}>
          {labelTop}
        </Text>
        <Text style={{ fontWeight: "700", fontSize: 12, color: "#fff" }}>
          {labelBottom}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

export default TablaTicketsMobile;
