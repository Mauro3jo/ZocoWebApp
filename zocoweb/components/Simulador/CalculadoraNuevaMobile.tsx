import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  REACT_APP_API_CALCULADORA_DATOS_TARJETA,
  REACT_APP_API_CALCULADORA_USUARIOS,
} from "@env";
import styles from "./CalculadoraNuevaMobile.styles";

export default function CalculadoraNuevaMobile() {
  const { control, handleSubmit, setValue } = useForm();

  const [isActive, setIsActive] = useState("Neto");
  const [isActiveDebito, setIsActiveDebito] = useState(true);
  const [selectedTarjeta, setSelectedTarjeta] = useState<any>(null);
  const [selectedCuota, setSelectedCuota] = useState<any>(null);
  const [tipoTarjetaBanco, setTipoTarjetaBanco] = useState<string | null>(null);
  const [showBancoOptions, setShowBancoOptions] = useState(false);

  const [optionsTarjeta, setOptionsTarjeta] = useState<any[]>([]);
  const [optionsCuotas, setOptionsCuotas] = useState<any[]>([]);
  const [datosTarjeta, setDatosTarjeta] = useState<any>({});
  const [formData, setFormData] = useState<any>(null);

  // 🔹 cargar tarjetas desde API
  useEffect(() => {
    const fetchDatosTarjeta = async () => {
      try {
        const response = await fetch(REACT_APP_API_CALCULADORA_DATOS_TARJETA);
        if (!response.ok) throw new Error("Error al obtener tarjetas");

        const data = await response.json();
        setDatosTarjeta(data);

        const tarjetasOptions = Object.keys(data).map((key) => ({
          value: key.toLowerCase(),
          label: key,
        }));

        setOptionsTarjeta(tarjetasOptions);
      } catch (error) {
        console.error("Error al obtener los datos de la tarjeta:", error);
      }
    };

    fetchDatosTarjeta();
  }, []);

  // 🔹 manejar cambio de tarjeta
  const handleTarjetaChange = (tarjeta: any) => {
    setSelectedTarjeta(tarjeta);

    const cuotasOptions =
      datosTarjeta[tarjeta.label]?.map((item: any) => {
        let label;
        if (tarjeta.label.toLowerCase() === "naranja" && item.cuota === 3) {
          label = "PlanZ";
        } else if (item.cuota === 13) {
          label = "Cuota simple 3";
        } else if (item.cuota === 16) {
          label = "Cuota simple 6";
        } else {
          label = `Cuota ${item.cuota}`;
        }
        return { value: item.cuota.toString(), label };
      }) || [];

    setOptionsCuotas(cuotasOptions);

    const defaultCuota = cuotasOptions.find((c) => c.value === "1");
    if (defaultCuota) {
      setValue("cuota", defaultCuota);
      setSelectedCuota(defaultCuota);
      setShowBancoOptions(true);
    } else {
      setShowBancoOptions(false);
    }
  };

  const toggleActive = (value: string) => {
    setIsActive(value);
    if (value === "Bruto") {
      const cuota0 = { value: "0", label: "Cuota 0" };
      setOptionsCuotas([cuota0]);
      setValue("cuota", cuota0);
      setSelectedCuota(cuota0);
    }
  };

  const handleTipoTarjetaChange = (tipo: string) => {
    setIsActiveDebito(tipo === "Debito");
    setValue("radio", tipo);

    if (tipo === "Debito") {
      const cuota0 = { value: "0", label: "Cuota 0" };
      setOptionsCuotas([cuota0]);
      setSelectedCuota(cuota0);
      setShowBancoOptions(false);
    }
  };

  const onSubmit = async (data: any) => {
    const token = await AsyncStorage.getItem("token");

    const finalData = {
      Token: token,
      Monto: data.netoBuscar.toString(),
      Cuota: data.cuota.value,
      TipoNetoBruto: isActive,
      TipoDebCred: data.radio,
      TipoTarjeta: data.tarjeta.value,
      Tarjeta: data.tarjeta.label,
      TipoTarjetaBanco: tipoTarjetaBanco,
    };

    try {
      const response = await fetch(REACT_APP_API_CALCULADORA_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const result = await response.json();
      setFormData(result);
    } catch (e) {
      console.error("Error en API:", e);
    }
  };

  const {
    alicuotaFinal,
    comisionMasIva,
    costoTarjeta,
    debcredFinal,
    montofinal,
    montoinicial,
    costoAnticipo,
  } = formData || {};

  return (
    <ScrollView style={styles.container}>
      {/* switches Neto/Bruto */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, isActive === "Bruto" && styles.switchActive]}
          onPress={() => toggleActive("Bruto")}
        >
          <Text style={styles.switchText}>Cobrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, isActive === "Neto" && styles.switchActive]}
          onPress={() => toggleActive("Neto")}
        >
          <Text style={styles.switchText}>Recibir</Text>
        </TouchableOpacity>
      </View>

      {/* input monto */}
      <Text style={styles.label}>
        {isActive === "Neto" ? "¿Cuánto quieres recibir?" : "¿Cuánto quieres cobrar?"}
      </Text>
      <Controller
        control={control}
        name="netoBuscar"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ingresa el monto"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* radios debito/credito */}
      <View style={styles.radioRow}>
        <TouchableOpacity onPress={() => handleTipoTarjetaChange("Debito")}>
          <Text style={styles.radioText}>Débito</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTipoTarjetaChange("Credito")}>
          <Text style={styles.radioText}>Crédito</Text>
        </TouchableOpacity>
      </View>

      {/* picker tarjeta */}
      <Text style={styles.label}>
        {isActive === "Neto" ? "¿Con qué Tarjeta te pagan?" : "¿Con qué Tarjeta querés cobrar?"}
      </Text>
      <Controller
        control={control}
        name="tarjeta"
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value?.value}
            style={styles.picker}
            onValueChange={(val, index) => {
              const tarjeta = optionsTarjeta[index];
              onChange(tarjeta);
              handleTarjetaChange(tarjeta);
            }}
          >
            {optionsTarjeta.map((opt, idx) => (
              <Picker.Item key={idx} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        )}
      />

      {/* picker cuotas */}
      <Text style={styles.label}>¿En cuántas cuotas?</Text>
      <Controller
        control={control}
        name="cuota"
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value?.value}
            enabled={!isActiveDebito}
            style={styles.picker}
            onValueChange={(val, index) => {
              const cuota = optionsCuotas[index];
              onChange(cuota);
              setSelectedCuota(cuota);
              setShowBancoOptions(cuota?.value === "1");
            }}
          >
            {optionsCuotas.map((opt, idx) => (
              <Picker.Item key={idx} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        )}
      />

      {/* banco options */}
      {showBancoOptions && (
        <View style={styles.radioRow}>
          <TouchableOpacity onPress={() => setTipoTarjetaBanco("Bancarizadas")}>
            <Text style={styles.radioText}>Bancarizadas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTipoTarjetaBanco("No Bancarizadas")}>
            <Text style={styles.radioText}>No Bancarizadas</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* boton */}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Calcular</Text>
      </TouchableOpacity>

      {/* resultados */}
      {formData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>
            {isActiveDebito ? "Débito" : "Crédito"}
          </Text>

          {/* Si recibís/cobrás */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>
              {isActive === "Neto" ? "Si recibís" : "Si cobrás"}
            </Text>
            <Text style={styles.textRightBig}>$ {montoinicial ?? "0"}</Text>
          </View>
          <View style={styles.separator} />

          {/* Arancel */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>Arancel + IVA</Text>
            <Text style={styles.textRight}>$ {comisionMasIva ?? "0"}</Text>
          </View>
          <View style={styles.separator} />

          {/* Costo financiero */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>Costo financiero + IVA</Text>
            <Text style={styles.textRight}>
              {selectedCuota && selectedCuota.value === "1"
                ? "$ 0"
                : `$ ${costoTarjeta ?? "0"}`}
            </Text>
          </View>
          <View style={styles.separator} />

          {/* Costo anticipo */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>Costo por anticipo + IVA</Text>
            <Text style={styles.textRight}>$ {costoAnticipo ?? "0"}</Text>
          </View>
          <View style={styles.separator} />

          {/* IIBB */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>Ret. Prov. (IIBB)</Text>
            <Text style={styles.textRight}>$ {alicuotaFinal ?? "0"}</Text>
          </View>
          <View style={styles.separator} />

          {/* Transc */}
          <View style={styles.row}>
            <Text style={styles.textLeft}>Cost. Transc.</Text>
            <Text style={styles.textRight}>$ {debcredFinal ?? "0"}</Text>
          </View>
          <View style={styles.separator} />

          {/* Total */}
          <View style={styles.row}>
            <Text style={styles.greenLeft}>
              {isActive === "Neto" ? "Cobrás" : "Recibís"}
            </Text>
            <Text style={styles.greenRight}>$ {montofinal ?? "0"}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
