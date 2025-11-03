import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_COMANDA_LISTAR_USUARIO } from "@env";
import { Ionicons } from "@expo/vector-icons";

import styles from "./ContenidoConsultasAliados.styles";
import ModalConsultasAliados from "./ModalConsultasAliados";

type Consulta = {
  motivo: string;
  direccion: string;
  provincia: string;
  observacionAliado?: string;
  estado: "pendiente" | "completado" | string;
  fechaApertura: string;
};

type Props = {
  contentBottomPadding?: number;
};

const ContenidoConsultasAliados: React.FC<Props> = ({
  contentBottomPadding = 0,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargarConsultas = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Sesión", "Tu sesión expiró. Iniciá sesión nuevamente.");
        setIsLoading(false);
        return;
      }

      const resp = await fetch(REACT_APP_API_COMANDA_LISTAR_USUARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Token: token }),
      });

      if (!resp.ok) throw new Error("La respuesta de la red no fue correcta");
      const data: Consulta[] = await resp.json();

      const ordenadas = [...data].sort(
        (a, b) =>
          new Date(b.fechaApertura).getTime() -
          new Date(a.fechaApertura).getTime()
      );

      setConsultas(ordenadas);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Hubo un error al obtener tus consultas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const renderItem = ({ item }: { item: Consulta }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardMotivo}>{item.motivo}</Text>
        <Text style={styles.cardDireccion}>
          {item.direccion}{"\n"}
          {item.provincia}
        </Text>
      </View>

      <View style={styles.separatorVertical} />

      <View style={styles.cardRight}>
        <View style={styles.estadoRow}>
          <Ionicons
            name={
              item.estado === "pendiente"
                ? "alert-circle-outline"
                : "checkmark-circle-outline"
            }
            size={14}
            color={item.estado === "pendiente" ? "#E53935" : "#B1C20E"}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.cardEstado,
              item.estado === "pendiente"
                ? styles.estadoPendiente
                : styles.estadoCompletado,
            ]}
          >
            {item.estado === "pendiente" ? "Pendiente" : "Completado"}
          </Text>
        </View>
        <Text style={styles.cardFecha}>
          {new Date(item.fechaApertura).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Franja gris superior */}
      <View style={styles.separatorTop} />

      {/* Título */}
      <Text style={styles.titulo}>CONSULTAS</Text>

      {/* Botón Nueva */}
      <View style={styles.newBtnRow}>
        <Pressable
          style={styles.btnNuevaConsulta}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#fff" />
          <Text style={styles.btnNuevaConsultaText}> Nueva</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#b4c400" />
          <Text style={styles.loadingText}>Esperando datos...</Text>
        </View>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 8,
            paddingBottom: contentBottomPadding,
          }}
        />
      )}

      <ModalConsultasAliados
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSaved={() => {
          setModalVisible(false);
          cargarConsultas();
        }}
      />
    </View>
  );
};

export default ContenidoConsultasAliados;
