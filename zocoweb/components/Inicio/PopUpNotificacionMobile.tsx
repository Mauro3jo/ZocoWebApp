import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface PopupResponse {
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  imagenBase64: string;
}

export default function PopUpNotificacionMobile() {
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_POPUP_ACTUAL;

  const hoy = new Date().toISOString().slice(0, 10);
  const storageKey = "popupMobileMostrado_" + hoy;

  const cerrar = () => {
    setVisible(false);
    setImg(null);
    try {
      global.localStorage?.setItem(storageKey, "1");
    } catch { }
  };

  const cargarPopup = async () => {
    try {
      const yaMostrado = global.localStorage?.getItem(storageKey);
      if (yaMostrado) return;

      const url = `${API_URL}?tipo=cel`;
      const res = await fetch(url);

      if (!res.ok) return;

      const data: PopupResponse = await res.json();

      // Validar rango de fechas
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      const hoyDate = new Date(hoy);

      if (hoyDate < inicio || hoyDate > fin) return;

      setImg(data.imagenBase64);
      setVisible(true);
    } catch (e) {
      console.log("Error popup mobile:", e);
    }
  };

  useEffect(() => {
    cargarPopup();
  }, []);

  if (!visible || !img) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Botón de cerrar como el Web (arriba a la derecha) */}
          <TouchableOpacity style={styles.closeBtn} onPress={cerrar}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Imagen del popup (solo versión CELULAR) */}
          <Image
            source={{ uri: img }}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Botón cerrar igual al web */}
          <TouchableOpacity style={styles.btnCerrar} onPress={cerrar}>
            <Text style={styles.btnCerrarText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    width: "92%",
    alignItems: "center",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 10,
    zIndex: 10,
    padding: 6,
  },
  closeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: 12,
    marginTop: 20,
  },
  btnCerrar: {
    backgroundColor: "#B1C20E",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  btnCerrarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
