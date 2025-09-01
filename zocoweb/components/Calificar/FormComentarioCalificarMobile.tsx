import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./FormComentarioCalificarMobile.styles";
import { REACT_APP_API_CALIFICAR_COM } from "@env";

const STAR_COLOR_ACTIVE = "#B4C400";
const STAR_COLOR_INACTIVE = "#343A40";

const FormComentarioCalificarMobile: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");

  const isButtonDisabled = rating === 0;

  const handleStarPress = (star: number) => setRating(star);

  const onSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Sesión", "Tu sesión expiró. Iniciá sesión nuevamente.");
        return;
      }

      const payload = {
        Token: token,
        NumCalifico: rating,
        Descripcion: comentario,
        Fecha: new Date().toISOString(),
      };

      await fetch(REACT_APP_API_CALIFICAR_COM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setRating(0);
      setComentario("");
      Alert.alert("¡Enviado!", "Tu comentario fue enviado con éxito.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Ocurrió un problema al enviar tu comentario.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 0 }}
    >
      {/* Caja de estrellas */}
      <View style={[styles.starsCard, styles.starsCardLight]}>
        <Text style={[styles.title, styles.textLight]}>
          Queremos conocer tu opinión sobre el servicio postventa brindado por
          Zoco.{"\n"}¿Cómo calificarías la calidad del servicio?
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Pressable
              key={s}
              hitSlop={10}
              onPress={() => handleStarPress(s)}
              style={styles.starTouch}
            >
              <Icon
                name="star"
                size={28}
                color={s <= rating ? STAR_COLOR_ACTIVE : STAR_COLOR_INACTIVE}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Texto guía */}
      <View style={styles.copyBlock}>
        <Text style={[styles.copyTitle, styles.textLight]}>
          ¿Tenés algún comentario o sugerencia?
        </Text>
        <Text style={[styles.copy, styles.textLight]}>
          Usá el espacio a continuación para expresar tus impresiones.{"\n"}
          <Text style={styles.italic}>
            Apreciamos tus comentarios y los tendremos en cuenta para seguir
            mejorando nuestro servicio.
          </Text>
        </Text>
      </View>

      {/* Textarea */}
      <TextInput
        multiline
        maxLength={500}
        editable={!isButtonDisabled}
        value={comentario}
        onChangeText={setComentario}
        placeholder="Ingresá tu texto aquí."
        placeholderTextColor="#6B7280"
        style={[styles.textarea, styles.textareaLight]}
      />

      {/* Botón enviar */}
      <Pressable
        disabled={isButtonDisabled}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.submitBtn,
          isButtonDisabled ? styles.submitBtnDisabled : styles.submitBtnEnabled,
          pressed && !isButtonDisabled ? styles.submitBtnPressed : null,
        ]}
      >
        <Text style={styles.submitText}>Enviar</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default FormComentarioCalificarMobile;
