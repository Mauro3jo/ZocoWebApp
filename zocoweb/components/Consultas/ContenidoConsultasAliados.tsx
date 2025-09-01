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

import styles from "./ContenidoConsultasAliados.styles";
import ModalConsultasAliados from "./ModalConsultasAliados";

type Consulta = {
  motivo: string;
  direccion: string;
  provincia: string;
  observacionAliado?: string;
  estado: "pendiente" | "completado" | string;
  fechaApertura: string; // ISO
};

type Props = {
  /** padding inferior para que no lo tape el tabbar */
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
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>{item.motivo}</Text>
            {"\n"}
            {item.direccion}, {item.provincia}
            {"\n"}
            {item.observacionAliado || ""}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text
            style={[
              styles.estado,
              item.estado === "pendiente"
                ? styles.estadoPendiente
                : styles.estadoCompletado,
            ]}
          >
            {item.estado === "pendiente" ? "Pendiente" : "Completado"}
          </Text>
          <Text style={styles.fecha}>
            {new Date(item.fechaApertura).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.newBtnRow}>
        <Pressable
          style={styles.btnNuevaConsulta}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnNuevaConsultaText}>Nueva</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#b4c400" />
          <Text style={{ marginTop: 8 }}>Esperando datos...</Text>
        </View>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 8,
            paddingBottom: contentBottomPadding, // 👈 separa del tabbar
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
