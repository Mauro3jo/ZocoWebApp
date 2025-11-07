import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
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

  // 🎨 Estilo común para todos los selects
  const pickerStyle = {
    inputIOS: styles.pickerBase,
    inputAndroid: styles.pickerBase,
    placeholder: {
      fontFamily: "Montserrat_400Regular",
      color: "#A9A9A9",
      fontSize: 14,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* switches Neto/Bruto */}
      <View style={styles.switchRow}>
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Cobrar</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#B1C20E" }}
            thumbColor="#fff"
            ios_backgroundColor="#ccc"
            value={isActive === "Bruto"}
            onValueChange={() => toggleActive("Bruto")}
          />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Recibir</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#B1C20E" }}
            thumbColor="#fff"
            ios_backgroundColor="#ccc"
            value={isActive === "Neto"}
            onValueChange={() => toggleActive("Neto")}
          />
        </View>
      </View>

      {/* input monto */}
      <Text style={styles.label}>
        {isActive === "Neto"
          ? "¿Cuánto querés recibir?"
          : "¿Cuánto querés cobrar?"}
      </Text>
      <Controller
        control={control}
        name="netoBuscar"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ingresa el monto"
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Picker tipo tarjeta */}
      <Text style={styles.label}>Tipo de tarjeta</Text>
      <Controller
        control={control}
        name="radio"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={(val) => {
              onChange(val);
              handleTipoTarjetaChange(val);
            }}
            items={[
              { label: "Débito", value: "Debito" },
              { label: "Crédito", value: "Credito" },
            ]}
            placeholder={{ label: "Seleccionar tipo...", value: null }}
            value={value}
            style={pickerStyle}
          />
        )}
      />

      {/* Picker tarjeta */}
      <Text style={styles.label}>
        {isActive === "Neto"
          ? "¿Con qué tarjeta te pagan?"
          : "¿Con qué tarjeta querés cobrar?"}
      </Text>
      <Controller
        control={control}
        name="tarjeta"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={(val, index) => {
              const tarjeta = optionsTarjeta[index];
              onChange(tarjeta);
              handleTarjetaChange(tarjeta);
            }}
            items={optionsTarjeta.map((opt) => ({
              label: opt.label,
              value: opt.value,
              key: opt.value,
            }))}
            placeholder={{ label: "Seleccionar tarjeta...", value: null }}
            value={value?.value}
            style={pickerStyle}
          />
        )}
      />

      {/* Picker cuotas */}
      <Text style={styles.label}>¿En cuántas cuotas?</Text>
      <Controller
        control={control}
        name="cuota"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={(val, index) => {
              const cuota = optionsCuotas[index];
              onChange(cuota);
              setSelectedCuota(cuota);
            }}
            items={optionsCuotas.map((opt) => ({
              label: opt.label,
              value: opt.value,
              key: opt.value,
            }))}
            placeholder={{ label: "Seleccionar cuota...", value: null }}
            disabled={isActiveDebito}
            value={value?.value}
            style={pickerStyle}
          />
        )}
      />

      {/* botón Calcular */}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Calcular</Text>
      </TouchableOpacity>

      {/* resultados */}
      {formData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>
            {isActiveDebito ? "Débito" : "Crédito"}
          </Text>

          <View style={styles.row}>
            <Text style={styles.textLeft}>
              {isActive === "Neto" ? "Si recibís" : "Si cobrás"}
            </Text>
            <Text style={styles.textRightBig}>$ {montoinicial ?? "0"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.textLeft}>Arancel + IVA</Text>
            <Text style={styles.textRight}>$ {comisionMasIva ?? "0"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.textLeft}>Costo financiero + IVA</Text>
            <Text style={styles.textRight}>
              {selectedCuota && selectedCuota.value === "1"
                ? "$ 0"
                : `$ ${costoTarjeta ?? "0"}`}
            </Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.textLeft}>Costo por anticipo + IVA</Text>
            <Text style={styles.textRight}>$ {costoAnticipo ?? "0"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.textLeft}>Ret. Prov. (IIBB)</Text>
            <Text style={styles.textRight}>$ {alicuotaFinal ?? "0"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.textLeft}>Cost. Transc.</Text>
            <Text style={styles.textRight}>$ {debcredFinal ?? "0"}</Text>
          </View>

          <View style={styles.separator} />
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
