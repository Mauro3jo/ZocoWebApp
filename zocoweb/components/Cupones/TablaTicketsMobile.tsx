import React, { ReactNode, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import {
  REACT_APP_API_EXCEL,
  REACT_APP_API_EXCEL_ANUAL,
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
  const [descargando, setDescargando] = useState<"mes" | "anual" | null>(null);

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

  const manejarDescargaExcel = async (url: string, body: any, nombre: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...body }),
    });

    if (!respuesta.ok) return;

    const blob = await respuesta.blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(",")[1];
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
    };

    reader.readAsDataURL(blob);
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
            <DownloadButton label="Descargar PDF" onPress={() => {}} loading={false} />

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
            bruto={item.totalBruto ?? 0}
            total={item.totalConDescuentos ?? 0}
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
      minWidth: 90,               // ← 🔥 previene que se achique DEMASIADO
      maxWidth: "33%",            // ← 🔥 evita que se desborde
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
          adjustsFontSizeToFit          // ← 🔥 auto ajuste
          numberOfLines={1}             // ← 🔥 evita salto
          minimumFontScale={0.75}       // ← 🔥 nunca se rompe
        >
          {label}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

export default TablaTicketsMobile;
