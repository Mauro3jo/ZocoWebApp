import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import IconMC from "react-native-vector-icons/MaterialCommunityIcons";
import Z from "../assets/svg/Z.svg";
import styles from "./HeaderPrincipal.styles";

export default function HeaderPrincipal() {
  const [nombre, setNombre] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const loadNombre = useCallback(async () => {
    try {
      const n = (await AsyncStorage.getItem("Nombre")) || "";
      setNombre(n);
    } catch {
      setNombre("");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNombre();
    }, [loadNombre])
  );

  const openModal = () => {
    setShowPasswordForm(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setShowPasswordForm(false);
  };

  return (
    <View>
      {/* HEADER PRINCIPAL */}
      <View style={styles.card}>
        <View style={styles.left}>
          <Z width={20} height={20} />
          <Text style={styles.text}>Hola{nombre ? `, ${nombre}` : ""}!</Text>
        </View>

        <TouchableOpacity
          style={styles.rightButton}
          activeOpacity={0.6}
          onPress={openModal}
        >
          <Image
            source={require("../assets/img/usuario.png")}
            style={styles.userIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        {/* Fondo oscuro */}
        <Pressable style={styles.overlay} onPress={closeModal} />

        {/* Contenedor central */}
        <View style={styles.modalContainer}>
          {!showPasswordForm ? (
            // 🔹 Menú principal
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <IconMC name="chevron-up" size={22} color="#000" />
              </TouchableOpacity>

              <Text style={styles.dropdownTitle}>{nombre || "ZOCO S.A.S"}</Text>
              <View style={styles.line} />

              <TouchableOpacity
                style={styles.changePassButton}
                onPress={() => setShowPasswordForm(true)}
              >
                <Text style={styles.changePassText}>Cambiar contraseña</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 🔹 Formulario
            <View style={styles.passwordForm}>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <IconMC name="chevron-up" size={22} color="#000" />
              </TouchableOpacity>

              <Text style={styles.formTitle}>Cambiar contraseña</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Ingresar contraseña anterior</Text>
                <TextInput style={styles.input} secureTextEntry />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Ingresar contraseña nueva</Text>
                <TextInput style={styles.input} secureTextEntry />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Ingresar contraseña nueva otra vez</Text>
                <TextInput style={styles.input} secureTextEntry />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
