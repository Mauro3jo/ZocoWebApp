import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_CALCULADORA_PLAZOS } from "@env";
import styles from "./CalculadoraPlazosMobile.styles";

export default function CalculadoraPlazosMobile() {
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [plazoData, setPlazoData] = useState<any | null>(null);

  const tipoOptions = [
    { value: "Debito", label: "Débito" },
    { value: "Alimentar", label: "Alimentar" },
    { value: "Credito1Pago", label: "Crédito 1 Pago" },
    { value: "Credito2Pago", label: "Crédito 2 o más Pagos" },
    { value: "CreditoCuotaSimple", label: "Crédito Cuota Simple" },
    { value: "Naranja", label: "Naranja" },
  ];

  const tarjetasPorTipo: Record<string, { value: string; label: string }[]> = {
    Debito: [
      { value: "Maestro/Electron Visa", label: "Bancarizada" },
      { value: "MC Debit/Visa Debit", label: "Billetera virtual" },
    ],
    Alimentar: [{ value: "Banco Nación/Provinciales", label: "Banco Nación/Provinciales" }],
    Credito1Pago: [
      { value: "Bancarizadas", label: "Bancarizadas" },
      { value: "No bancarizadas", label: "No bancarizadas" },
      { value: "Recargables", label: "Recargables" },
    ],
    Credito2Pago: [
      { value: "Bancarizadas", label: "Bancarizadas" },
      { value: "No bancarizadas", label: "No bancarizadas" },
    ],
    CreditoCuotaSimple: [{ value: "Bancarizadas", label: "Bancarizadas" }],
    Naranja: [{ value: "Naranja", label: "Naranja" }],
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const finalData = { fecha, tipo, tarjeta, Token: token };

    try {
      const response = await fetch(REACT_APP_API_CALCULADORA_PLAZOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData), // token va en body
      });

      if (!response.ok) throw new Error("Error en la API");
      const responseData = await response.json();
      setPlazoData(responseData);
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={fecha}
          onChangeText={setFecha}
          maxLength={10}
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={setTipo}>
            <Picker.Item label="Seleccionar tipo" value="" />
            {tipoOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tarjeta</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tarjeta} onValueChange={setTarjeta}>
            <Picker.Item label="Seleccionar tarjeta" value="" />
            {tarjetasPorTipo[tipo]?.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Calcular</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          <FontAwesome name="exclamation-circle" size={14} /> Primero ingresá la
          fecha en formato Día/Mes/Año, luego seleccioná el tipo de pago y la
          Tarjeta.
        </Text>
      </View>

      {/* Resultados */}
      <View style={styles.resultCard}>
        {plazoData ? (
          <View>
            <Text style={styles.resultTitle}>Voy a recibir el pago el</Text>
            <Text style={styles.resultDate}>
              {plazoData.resultado?.nuevaFecha ?? ""}
            </Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.subtitle}>Tipo de tarjeta</Text>
                <Text style={styles.bold}>{plazoData.resultado?.tarjeta}</Text>
                <Text>{plazoData.resultado?.detalles}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.subtitle}>Plazo</Text>
                <Text style={styles.green}>{plazoData.resultado?.detalle}</Text>
              </View>
            </View>

            <Text style={styles.alert}>
              <FontAwesome name="exclamation-circle" size={14} color="red" /> En
              caso de feriado o día no hábil, el pago es diferido al siguiente
              día hábil.
            </Text>
          </View>
        ) : (
          <Text style={styles.noData}>
            Ingrese los datos para visualizar el resultado
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
