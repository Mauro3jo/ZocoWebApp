import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  REACT_APP_API_LISTA_AFIP,
  REACT_APP_API_AFIP,
  REACT_APP_API_IIBB,
  REACT_APP_API_FACTURANTE,
} from "@env";

type FilaMes = {
  mes: string;
  tieneAfip?: boolean;
  tieneIibb?: boolean;
  tieneFacturante?: boolean;
};

type RespuestaLista = {
  fechasDisponibles?: FilaMes[];
};

const TablaContabilidadArchivos: React.FC = () => {
  const [datosContabilidadArchivo, setDatosContabilidadArchivo] = useState<RespuestaLista>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
  });

  const showAlert = (title: string, message: string) =>
    setAlertConfig({ show: true, title, message });
  const closeAlert = () => setAlertConfig({ show: false, title: "", message: "" });

  // ======== CONSULTA 1: lista de meses (POST REACT_APP_API_LISTA_AFIP) =========
  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showAlert("Error", "No hay token disponible");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(REACT_APP_API_LISTA_AFIP, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: RespuestaLista = await response.json();
        setDatosContabilidadArchivo(data);
      } catch {
        showAlert("Error", "No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ======== Helpers (en RN no se descarga con <a>, solo feedback) =========
  const procesarDocumentos = (documentos: any[], tipo: string) => {
    if (!Array.isArray(documentos) || documentos.length === 0) {
      showAlert("Aviso", `No hay documentos para ${tipo}`);
      return;
    }
    // Para guardar/abrir PDF luego: usar expo-file-system o react-native-fs.
    showAlert("OK", `Descargados ${documentos.length} documentos de ${tipo}`);
  };

  // ======== CONSULTA 2: descargar AFIP (POST REACT_APP_API_AFIP) ========
  const handleDownloadAfip = async (mes: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      showAlert("Error", "No hay token disponible");
      return;
    }
    try {
      const response = await fetch(REACT_APP_API_AFIP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fecha: mes }),
      });
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const documentos = await response.json();
      procesarDocumentos(documentos, "AFIP (IVA-Ganancia)");
    } catch {
      showAlert("Error", "Error al descargar los PDFs de AFIP");
    }
  };

  // ======== CONSULTA 3: descargar IIBB (POST REACT_APP_API_IIBB) ========
  const handleDownloadIIBB = async (mes: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      showAlert("Error", "No hay token disponible");
      return;
    }
    try {
      const response = await fetch(REACT_APP_API_IIBB, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fecha: mes }),
      });
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const documentos = await response.json();
      procesarDocumentos(documentos, "IIBB");
    } catch {
      showAlert("Error", "Error al descargar los PDFs de IIBB");
    }
  };

  // ======== CONSULTA 4: descargar Facturante (POST REACT_APP_API_FACTURANTE) ========
  const handleDownloadFacturante = async (mes: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      showAlert("Error", "No hay token disponible");
      return;
    }
    try {
      const response = await fetch(REACT_APP_API_FACTURANTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fecha: mes }),
      });
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const documentos = await response.json();
      procesarDocumentos(documentos, "Facturante");
    } catch {
      showAlert("Error", "Error al descargar los PDFs de Facturante");
    }
  };

  // ======== UI ========
  const filas: FilaMes[] = [...(datosContabilidadArchivo?.fechasDisponibles ?? [])].reverse();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Comprobantes de factura - Retención</Text>
      </View>

      {/* Tabla sin scroll lateral (sólo vertical si hace falta) */}
      {loading ? (
        <ActivityIndicator size="large" color="#B1C20E" style={{ margin: 20 }} />
      ) : (
        <View>
          {/* Cabecera (4 columnas) */}
          <View style={styles.rowHeader}>
            <Text style={[styles.cellHeader, styles.colMes]}>MES</Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>Factura</Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>IVA-Ganancia</Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>IIBB</Text>
          </View>

          {/* Filas con scroll vertical libre */}
          <ScrollView nestedScrollEnabled contentContainerStyle={{ paddingBottom: 8 }}>
            {filas.length > 0 ? (
              filas.map((dato, idx) => (
                <View key={`${dato.mes}-${idx}`} style={styles.row}>
                  <Text style={[styles.cellText, styles.colMes]} numberOfLines={1}>
                    {dato.mes}
                  </Text>

                  {/* Facturante */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneFacturante ? (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleDownloadFacturante(dato.mes)}
                      >
                        <Text style={styles.btnText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>No hay archivo para descargar</Text>
                    )}
                  </View>

                  {/* AFIP */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneAfip ? (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleDownloadAfip(dato.mes)}
                      >
                        <Text style={styles.btnText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>No hay archivo para descargar</Text>
                    )}
                  </View>

                  {/* IIBB */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneIibb ? (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleDownloadIIBB(dato.mes)}
                      >
                        <Text style={styles.btnText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>No hay archivo para descargar</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyRow}>
                <Text style={styles.noFile}>No tiene datos</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Alertas */}
      <AwesomeAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside
        closeOnHardwareBackPress={false}
        showConfirmButton
        confirmText="OK"
        confirmButtonColor="#B1C20E"
        onConfirmPressed={closeAlert}
      />
    </View>
  );
};

export default TablaContabilidadArchivos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    padding: 10,
  },
header: {
  paddingVertical: 14,
  backgroundColor: "#B1C20E",
  alignItems: "center",
  marginBottom: 12,
  borderRadius: 8,
},
headerText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FFFFFF",
},


  /* cabecera y filas */
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#F2F4F7",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E4EA",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E1E4EA",
    paddingVertical: 10,
  },
  emptyRow: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E1E4EA",
  },

  /* columnas */
  colMes: { flex: 1.3, paddingHorizontal: 10 },
  colAccion: { flex: 1, paddingHorizontal: 6 },

  /* celdas */
  cellHeader: {
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    fontSize: 13,
  },
  cellText: {
    color: "#30313A",
    fontSize: 13,
  },
  center: { alignItems: "center", justifyContent: "center" },

  /* botón */
  btn: {
    backgroundColor: "#B1C20E",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 96,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  noFile: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
  },
});
