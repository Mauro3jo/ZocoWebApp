import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import IconMC from "react-native-vector-icons/MaterialCommunityIcons";
import Z from "../assets/svg/Z.svg";

export default function HeaderPrincipal() {
  const [nombre, setNombre] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));

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

  const toggleDropdown = () => {
    const toValue = open ? 0 : 110; // altura del menú desplegable
    Animated.timing(heightAnim, {
      toValue,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  return (
    <View>
      {/* HEADER PRINCIPAL */}
      <View style={styles.card}>
        <View style={styles.left}>
          <Z width={20} height={20} />
          <Text style={styles.text}>Hola{nombre ? `, ${nombre}` : ""}!</Text>
        </View>

        {/* Botón de usuario */}
        <TouchableOpacity
          style={styles.rightButton}
          activeOpacity={0.6}
          onPress={toggleDropdown}
        >
          <Image
            source={require("../assets/img/usuario.png")}
            style={styles.userIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* MENÚ DESPLEGABLE */}
      <Animated.View style={[styles.dropdown, { height: heightAnim }]}>
        <View style={styles.dropdownContent}>
          {/* Flecha para replegar */}
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={toggleDropdown}
            activeOpacity={0.7}
          >
            <IconMC name="chevron-up" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.dropdownTitle}>{nombre || "ZOCO S.A.S"}</Text>
          <View style={styles.line} />
          <TouchableOpacity style={styles.changePassButton}>
            <Text style={styles.changePassText}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  rightButton: {
    padding: 5,
  },
  userIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  dropdown: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dropdownContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  arrowContainer: {
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 2,
  },
  dropdownTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  line: {
    width: "80%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  changePassButton: {
    paddingVertical: 4,
  },
  changePassText: {
    fontSize: 14,
    color: "#000",
  },
});
