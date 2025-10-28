import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_COMANDA_CREAR } from "@env";
import styles from "./ModalConsultasAliados.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const motivos = [
  "Solicitud de rollos",
  "Consulta técnica",
  "Consulta/Modificación de datos",
  "Consulta sobre mi liquidación",
  "Quiero darme de baja",
  "Otra consulta",
];

const provincias = [
  "Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos",
  "Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén",
  "Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe",
  "Santiago del Estero","Tierra del Fuego","Tucumán",
];

export default function ModalConsultasAliados({ visible, onClose, onSaved }: Props) {
  const [Motivo, setMotivo] = useState("");
  const [Observacion, setObservacion] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Provincia, setProvincia] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showMotivoSelect, setShowMotivoSelect] = useState(false);
  const [showProvinciaSelect, setShowProvinciaSelect] = useState(false);

  const reset = () => {
    setMotivo("");
    setObservacion("");
    setDireccion("");
    setProvincia("");
    setTelefono("");
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Sesión", "Tu sesión expiró. Iniciá sesión nuevamente.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        Token: token,
        Motivo,
        Observacion,
        Direccion,
        Provincia,
        Telefono,
        estado: "pendiente",
      };

      const resp = await fetch(REACT_APP_API_COMANDA_CREAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Hubo un problema al enviar los datos");

      Alert.alert("Éxito", "Los datos han sido enviados correctamente");
      reset();
      onSaved();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Hubo un problema al enviar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOption = (label: string, onPick: (v: string) => void, close: () => void) => (
    <Pressable
      onPress={() => {
        onPick(label);
        close();
      }}
      style={styles.optionRow}
    >
      <Text style={[styles.optionText, { fontFamily: "Montserrat_500Medium" }]}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ width: 28 }} />
            <Text style={[styles.headerTitle, { fontFamily: "Montserrat_700Bold" }]}>
              Nueva consulta
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { fontFamily: "Montserrat_600SemiBold" }]}>
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Motivo */}
            <Text style={[styles.label, { fontFamily: "Montserrat_600SemiBold" }]}>Motivo</Text>
            <Pressable style={styles.selectInput} onPress={() => setShowMotivoSelect(true)}>
              <Text
                style={[
                  Motivo ? styles.selectValue : styles.selectPlaceholder,
                  { fontFamily: "Montserrat_500Medium" },
                ]}
              >
                {Motivo || "Seleccioná un motivo"}
              </Text>
            </Pressable>
            <Text style={[styles.hint, { fontFamily: "Montserrat_400Regular" }]}>
              Opciones: {motivos.join(" • ")}
            </Text>

            {/* Comentario */}
            <Text style={[styles.label, { fontFamily: "Montserrat_600SemiBold" }]}>Comentario</Text>
            <TextInput
              value={Observacion}
              onChangeText={setObservacion}
              placeholder="Ej: Necesitamos rollos hoy por favor"
              style={[styles.input, styles.textarea, { fontFamily: "Montserrat_400Regular" }]}
              multiline
            />

            {/* Dirección / Provincia / Teléfono */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { fontFamily: "Montserrat_600SemiBold" }]}>
                  Dirección
                </Text>
                <TextInput
                  value={Direccion}
                  onChangeText={setDireccion}
                  placeholder="Dirección local"
                  style={[styles.input, { fontFamily: "Montserrat_400Regular" }]}
                />
              </View>

              <View style={styles.col}>
                <Text style={[styles.label, { fontFamily: "Montserrat_600SemiBold" }]}>
                  Provincia
                </Text>
                <Pressable
                  style={styles.selectInput}
                  onPress={() => setShowProvinciaSelect(true)}
                >
                  <Text
                    style={[
                      Provincia ? styles.selectValue : styles.selectPlaceholder,
                      { fontFamily: "Montserrat_500Medium" },
                    ]}
                  >
                    {Provincia || "Provincia"}
                  </Text>
                </Pressable>
                <Text style={[styles.hintSmall, { fontFamily: "Montserrat_400Regular" }]}>
                  Ej: {provincias.slice(0, 5).join(", ")}...
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={[styles.label, { fontFamily: "Montserrat_600SemiBold" }]}>
                  N° Teléfono
                </Text>
                <TextInput
                  value={Telefono}
                  onChangeText={setTelefono}
                  placeholder="0123456789"
                  keyboardType="numeric"
                  style={[styles.input, { fontFamily: "Montserrat_400Regular" }]}
                />
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Pressable onPress={onClose} style={[styles.btn, styles.btnCancel]}>
                <Text style={[styles.btnText, { fontFamily: "Montserrat_600SemiBold" }]}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting || !Motivo || !Provincia}
                style={[
                  styles.btn,
                  styles.btnSave,
                  (isSubmitting || !Motivo || !Provincia) && { opacity: 0.6 },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.btnText, { fontFamily: "Montserrat_700Bold" }]}>
                    Guardar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* SELECT Motivo */}
      <Modal
        visible={showMotivoSelect}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMotivoSelect(false)}
      >
        <View style={styles.selectBackdrop}>
          <View style={styles.selectSheet}>
            <Text style={[styles.selectTitle, { fontFamily: "Montserrat_700Bold" }]}>
              Seleccioná un motivo
            </Text>
            <FlatList
              data={motivos}
              keyExtractor={(it) => it}
              renderItem={({ item }) =>
                renderOption(item, setMotivo, () => setShowMotivoSelect(false))
              }
            />
            <Pressable
              style={[styles.btn, styles.btnCancel, { marginTop: 12 }]}
              onPress={() => setShowMotivoSelect(false)}
            >
              <Text style={[styles.btnText, { fontFamily: "Montserrat_600SemiBold" }]}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SELECT Provincia */}
      <Modal
        visible={showProvinciaSelect}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProvinciaSelect(false)}
      >
        <View style={styles.selectBackdrop}>
          <View style={styles.selectSheet}>
            <Text style={[styles.selectTitle, { fontFamily: "Montserrat_700Bold" }]}>
              Seleccioná una provincia
            </Text>
            <FlatList
              data={provincias}
              keyExtractor={(it) => it}
              renderItem={({ item }) =>
                renderOption(item, setProvincia, () => setShowProvinciaSelect(false))
              }
            />
            <Pressable
              style={[styles.btn, styles.btnCancel, { marginTop: 12 }]}
              onPress={() => setShowProvinciaSelect(false)}
            >
              <Text style={[styles.btnText, { fontFamily: "Montserrat_600SemiBold" }]}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
