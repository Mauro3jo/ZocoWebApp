import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
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
    Alimentar: [
      { value: "Banco Nación/Provinciales", label: "Banco Nación/Provinciales" },
    ],
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
    const finalData = { fecha, tipo, tarjeta };

    try {
      const response = await fetch(REACT_APP_API_CALCULADORA_PLAZOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error("Error en la API");
      const data = await response.json();
      setPlazoData(data);
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  const handleFechaChange = (text: string) => {
    let clean = text.replace(/\D/g, "");
    if (clean.length > 2 && clean.length <= 4)
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    else if (clean.length > 4)
      clean = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    setFecha(clean);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#777"
          value={fecha}
          onChangeText={handleFechaChange}
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipo}
            onValueChange={setTipo}
            dropdownIconColor="#000"
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Seleccionar tipo" value="" color="#777" />
            {tipoOptions.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
                color="#000"
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tarjeta</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tarjeta}
            onValueChange={setTarjeta}
            dropdownIconColor="#000"
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Seleccionar tarjeta" value="" color="#777" />
            {tarjetasPorTipo[tipo]?.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
                color="#000"
              />
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
          <View style={{ paddingHorizontal: 10 }}>
            {Object.entries(plazoData.resultado)
              .filter(([key, value]) => key.startsWith("tieneDetalles") && value)
              .map(([key]) => {
                const match = key.match(/(\d+Hs|\d+Dias|Naranja)/);
                const timeFrame = match ? match[0] : null;

                if (
                  !timeFrame ||
                  plazoData.resultado[`nuevaFecha${timeFrame}`] === null
                )
                  return null;

                return (
                  <View key={key} style={{ marginBottom: 20 }}>
                    <Text style={styles.resultTitle}>
                      Voy a recibir el pago el
                    </Text>
                    <Text style={styles.resultDate}>
                      {plazoData.resultado[`nuevaFecha${timeFrame}`]}
                    </Text>

                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Text style={styles.subtitle}>Tipo de tarjeta</Text>
                        <Text style={styles.bold}>
                          {plazoData.resultado.tarjeta}
                        </Text>
                        <Text style={styles.normalText}>
                          {plazoData.resultado[`detalles${timeFrame}`]}
                        </Text>
                      </View>
                      <View style={styles.col}>
                        <Text style={styles.subtitle}>Plazo</Text>
                        <Text style={styles.green}>
                          {plazoData.resultado[`detalle${timeFrame}`]}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

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
    </View>
  );
}
