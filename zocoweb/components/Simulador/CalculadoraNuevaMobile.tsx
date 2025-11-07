import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
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
    if (!tarjeta || !tarjeta.label) {
      setOptionsCuotas([]);
      setSelectedCuota(null);
      setValue("cuota", null);
      return;
    }

    setSelectedTarjeta(tarjeta);

    let cuotas = datosTarjeta[tarjeta.label] || [];

    // Si es crédito, excluimos cuota 0
    if (!isActiveDebito) {
      cuotas = cuotas.filter((item: any) => item.cuota !== 0);
    }

    const cuotasOptions = cuotas.map((item: any) => {
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
    });

    setOptionsCuotas(cuotasOptions);

    const defaultCuota =
      isActiveDebito
        ? { value: "0", label: "Cuota 0" }
        : cuotasOptions.find((c) => c.value === "1");

    if (defaultCuota) {
      setValue("cuota", defaultCuota);
      setSelectedCuota(defaultCuota);
    }
  };

  const toggleActive = (value: string) => {
    setIsActive(value);
    if (value === "Bruto" && isActiveDebito) {
      const cuota0 = { value: "0", label: "Cuota 0" };
      setOptionsCuotas([cuota0]);
      setValue("cuota", cuota0);
      setSelectedCuota(cuota0);
    }
  };

  // 🔹 manejo tipo de tarjeta
  const handleTipoTarjetaChange = (tipo: string) => {
    const esDebito = tipo === "Debito";
    setIsActiveDebito(esDebito);
    setValue("radio", tipo);

    if (esDebito) {
      // Solo Cuota 0
      const cuota0 = { value: "0", label: "Cuota 0" };
      setOptionsCuotas([cuota0]);
      setSelectedCuota(cuota0);
      setValue("cuota", cuota0);
    } else {
      // Crédito: quitar cuota 0
      if (selectedTarjeta && datosTarjeta[selectedTarjeta.label]) {
        const cuotasFiltradas = datosTarjeta[selectedTarjeta.label].filter(
          (c: any) => c.cuota !== 0
        );
        const opciones = cuotasFiltradas.map((item: any) => {
          let label;
          if (
            selectedTarjeta.label.toLowerCase() === "naranja" &&
            item.cuota === 3
          ) {
            label = "PlanZ";
          } else if (item.cuota === 13) {
            label = "Cuota simple 3";
          } else if (item.cuota === 16) {
            label = "Cuota simple 6";
          } else {
            label = `Cuota ${item.cuota}`;
          }
          return { value: item.cuota.toString(), label };
        });
        setOptionsCuotas(opciones);
        const defaultCuota = opciones.find((c) => c.value === "1");
        if (defaultCuota) {
          setValue("cuota", defaultCuota);
          setSelectedCuota(defaultCuota);
        }
      } else {
        setOptionsCuotas([]);
        setSelectedCuota(null);
      }
    }
  };

  const onSubmit = async (data: any) => {
    const token = await AsyncStorage.getItem("token");

    const finalData = {
      Token: token,
      Monto: data.netoBuscar.toString(),
      Cuota: data.cuota?.value ?? "0",
      TipoNetoBruto: isActive,
      TipoDebCred: data.radio,
      TipoTarjeta: data.tarjeta?.value ?? "",
      Tarjeta: data.tarjeta?.label ?? "",
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
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              style={styles.picker}
              dropdownIconColor="#000"
              onValueChange={(val) => {
                onChange(val);
                handleTipoTarjetaChange(val);
              }}
            >
              <Picker.Item label="Seleccionar tipo..." value={null} />
              <Picker.Item label="Débito" value="Debito" />
              <Picker.Item label="Crédito" value="Credito" />
            </Picker>
          </View>
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
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value?.value}
              style={styles.picker}
              dropdownIconColor="#000"
              onValueChange={(val, index) => {
                const tarjeta = optionsTarjeta[index];
                if (tarjeta) {
                  onChange(tarjeta);
                  handleTarjetaChange(tarjeta);
                }
              }}
            >
              <Picker.Item label="Seleccionar tarjeta..." value={null} />
              {optionsTarjeta.map((opt, idx) => (
                <Picker.Item key={idx} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        )}
      />

      {/* Picker cuotas */}
      <Text style={styles.label}>¿En cuántas cuotas?</Text>
      <Controller
        control={control}
        name="cuota"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value?.value}
              enabled={!isActiveDebito}
              style={styles.picker}
              dropdownIconColor="#000"
              onValueChange={(val, index) => {
                const cuota = optionsCuotas[index];
                if (cuota) {
                  onChange(cuota);
                  setSelectedCuota(cuota);
                }
              }}
            >
              <Picker.Item label="Seleccionar cuota..." value={null} />
              {optionsCuotas.map((opt, idx) => (
                <Picker.Item key={idx} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
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
