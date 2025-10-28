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
  const [datosContabilidadArchivo, setDatosContabilidadArchivo] =
    useState<RespuestaLista>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
  });

  const showAlert = (title: string, message: string) =>
    setAlertConfig({ show: true, title, message });
  const closeAlert = () =>
    setAlertConfig({ show: false, title: "", message: "" });

  // ======== CONSULTA 1: lista de meses =========
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
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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

  // ======== Helpers =========
  const procesarDocumentos = (documentos: any[], tipo: string) => {
    if (!Array.isArray(documentos) || documentos.length === 0) {
      showAlert("Aviso", `No hay documentos para ${tipo}`);
      return;
    }
    showAlert("OK", `Descargados ${documentos.length} documentos de ${tipo}`);
  };

  // ======== Descarga =========
  const handleDownload = async (url: string, mes: string, tipo: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      showAlert("Error", "No hay token disponible");
      return;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fecha: mes }),
      });
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const documentos = await response.json();
      procesarDocumentos(documentos, tipo);
    } catch {
      showAlert("Error", `Error al descargar los PDFs de ${tipo}`);
    }
  };

  const filas: FilaMes[] = [
    ...(datosContabilidadArchivo?.fechasDisponibles ?? []),
  ].reverse();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Comprobantes de factura - Retención
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#B1C20E" style={{ margin: 20 }} />
      ) : (
        <View>
          {/* Cabecera */}
          <View style={styles.rowHeader}>
            <Text style={[styles.cellHeader, styles.colMes]}>MES</Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>Factura</Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>
              IVA-Ganancia
            </Text>
            <Text style={[styles.cellHeader, styles.colAccion]}>IIBB</Text>
          </View>

          {/* Filas */}
          <ScrollView nestedScrollEnabled contentContainerStyle={{ paddingBottom: 8 }}>
            {filas.length > 0 ? (
              filas.map((dato, idx) => (
                <View key={`${dato.mes}-${idx}`} style={styles.row}>
                  <Text
                    style={[styles.cellText, styles.colMes]}
                    numberOfLines={1}
                  >
                    {dato.mes}
                  </Text>

                  {/* Facturante */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneFacturante ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleDownload(
                            REACT_APP_API_FACTURANTE,
                            dato.mes,
                            "Facturante"
                          )
                        }
                      >
                        <Text style={styles.linkText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>
                        No hay archivo para descargar
                      </Text>
                    )}
                  </View>

                  {/* AFIP */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneAfip ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleDownload(
                            REACT_APP_API_AFIP,
                            dato.mes,
                            "AFIP (IVA-Ganancia)"
                          )
                        }
                      >
                        <Text style={styles.linkText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>
                        No hay archivo para descargar
                      </Text>
                    )}
                  </View>

                  {/* IIBB */}
                  <View style={[styles.colAccion, styles.center]}>
                    {dato.tieneIibb ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleDownload(
                            REACT_APP_API_IIBB,
                            dato.mes,
                            "IIBB"
                          )
                        }
                      >
                        <Text style={styles.linkText}>Descargar</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.noFile}>
                        No hay archivo para descargar
                      </Text>
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
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
  },

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

  colMes: { flex: 1.3, paddingHorizontal: 10 },
  colAccion: { flex: 1, paddingHorizontal: 6 },

  cellHeader: {
    color: "#222",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },
  cellText: {
    color: "#30313A",
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
  },
  center: { alignItems: "center", justifyContent: "center" },

  linkText: {
    color: "#B1C20E",
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },

  noFile: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Montserrat_300Light",
  },
});
