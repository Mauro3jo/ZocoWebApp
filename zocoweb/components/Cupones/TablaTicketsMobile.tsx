import React, { ReactNode, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert, // Agregué Alert por si hay errores
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import {
  REACT_APP_API_EXCEL,
  REACT_APP_API_EXCEL_ANUAL,
  REACT_APP_API_PDF_ANDROID_MENSUAL
} from "@env";
import ItemsTablaTicketMobile from "./ItemsTablaTicketMobile";

type ItemMes = {
  fecha?: string;
  fechaPago?: string;
  fechaOperacion?: string;
  totalBruto?: number | string;
  totalConDescuentos?: number | string;
};

type Props = {
  listaMes: ItemMes[];
  datos?: { anio?: number; mes?: number; comercio?: string } | null;
  headerComponent?: ReactNode;
  bottomPadding?: number;
};

const TablaTicketsMobile: React.FC<Props> = ({
  listaMes,
  datos,
  headerComponent,
  bottomPadding = 0,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [descargando, setDescargando] = useState<"mes" | "anual" | "pdf" | null>(null);

  const lista = useMemo(() => (Array.isArray(listaMes) ? listaMes : []), [listaMes]);
  const listaFiltrada = useMemo(() => {
    const b = busqueda.trim().toLowerCase();
    if (!b) return lista;
    return lista.filter((it) =>
      (it.fechaPago ?? it.fecha ?? it.fechaOperacion ?? "")
        .toLowerCase()
        .includes(b)
    );
  }, [lista, busqueda]);

  const fmtNombre = (nombre: string) => nombre.replace(/[^a-zA-Z0-9]/g, "_");

  // Función genérica para Excel (sigue usando Blob porque el endpoint de Excel no lo cambiamos)
  const manejarDescargaExcel = async (url: string, body: any, nombre: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...body }),
      });

      if (!respuesta.ok) throw new Error("Error al generar Excel");

      const blob = await respuesta.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64data = reader.result.split(",")[1];
          const fileUri = FileSystem.cacheDirectory + nombre;

          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
          }
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo descargar el archivo Excel.");
    }
  };

  const onDescargarExcelMes = async () => {
    if (descargando) return;
    setDescargando("mes");
    const hoy = new Date();
    const Year = Number(datos?.anio ?? hoy.getFullYear());
    const Month = Number(datos?.mes ?? hoy.getMonth() + 1);
    let comercio = fmtNombre(String(datos?.comercio ?? "Todos"));

    await manejarDescargaExcel(
      REACT_APP_API_EXCEL,
      { Year, Month, comercio },
      `reporte_Zoco_${comercio}_${Year}-${Month}.xlsx`
    );
    setDescargando(null);
  };

  const onDescargarExcelAnual = async () => {
    if (descargando) return;
    setDescargando("anual");
    const hoy = new Date();
    const Year = Number(datos?.anio ?? hoy.getFullYear());
    let comercio = fmtNombre(String(datos?.comercio ?? "Todos"));

    await manejarDescargaExcel(
      REACT_APP_API_EXCEL_ANUAL,
      { Year, comercio },
      `reporte_anual_Zoco_${comercio}_${Year}.xlsx`
    );
    setDescargando(null);
  };

  // 🔥 LÓGICA CORREGIDA PARA EL PDF DESDE BASE64
  const onDescargarPDF = async () => {
    if (descargando) return;
    setDescargando("pdf");

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setDescargando(null);
      return;
    }

    const Year = datos?.anio ?? new Date().getFullYear();
    const Month = datos?.mes ?? new Date().getMonth() + 1;
    const comercio = datos?.comercio ?? "Todos";

    try {
      const respuesta = await fetch(REACT_APP_API_PDF_ANDROID_MENSUAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          Year,
          Month,
          comercio,
        }),
      });

      if (!respuesta.ok) throw new Error("Error en respuesta del servidor");

      // 1. Recibimos JSON
      const data = await respuesta.json();

      // 2. Obtenemos el Base64 limpio
      const base64Code = data.pdfBase64;
      const fileName = data.archivo || `reporte_${Year}_${Month}.pdf`;

      if (!base64Code) throw new Error("No se recibió el PDF");

      // 3. Escribimos el archivo
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4. Compartimos
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
          dialogTitle: "Guardar PDF Mensual"
        });
      }

    } catch (error) {
      console.log("Error PDF:", error);
      Alert.alert("Error", "Hubo un problema al generar el PDF.");
    } finally {
      setDescargando(null);
    }
  };

  return (
    <FlatList
      data={listaFiltrada}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={
        <View style={{ gap: 16, paddingHorizontal: 20, paddingTop: 20 }}>
          {headerComponent}

          <Text style={{ fontSize: 16, fontFamily: "Montserrat_700Bold" }}>
            Buscar por fecha:
          </Text>
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Ej: 01-01-2024"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#fff",
            }}
          />

          {/* 🔥 FILA DE BOTONES RESPONSIVA */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <DownloadButton
              label="Descargar PDF"
              onPress={onDescargarPDF}
              loading={descargando === "pdf"}
            />

            <DownloadButton
              label="Descargar Excel"
              onPress={onDescargarExcelMes}
              loading={descargando === "mes"}
            />

            <DownloadButton
              label="Descargar Anual"
              onPress={onDescargarExcelAnual}
              loading={descargando === "anual"}
            />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 20 }}>
          <ItemsTablaTicketMobile
            fechaDisplay={item.fechaPago ?? item.fecha ?? ""}
            bruto={Number(item.totalBruto ?? 0)}
            total={Number(item.totalConDescuentos ?? 0)}
          />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    />
  );
};

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
      minWidth: 90,
      maxWidth: "33%",
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
      <ActivityIndicator color="#fff" />
    ) : (
      <>
        <Feather name="download" size={18} color="#fff" />

        <Text
          style={{
            fontSize: 13,
            color: "#fff",
            fontFamily: "Montserrat_700Bold",
            textAlign: "center",
            width: "100%",
          }}
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.75}
        >
          {label}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

export default TablaTicketsMobile;