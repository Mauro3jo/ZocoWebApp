import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./PaymentTableMobile.styles";

export default function PaymentTableMobile() {
  const data = [
    {
      category: "DÉBITO",
      description:
        "Bancarizadas (Tarjetas de Débito de bancos virtuales, Brubank, Mercadopago y todas las recargables)",
      days: "24 hs hábiles ",
    },
    {
      category: "DÉBITO",
      description:
        "Billeteras virtuales (Bancos Nacionales, Provinciales y privados)",
      days: "48 hs hábiles",
    },
    {
      category: "ALIMENTAR",
      description: "Banco Nación/Provinciales",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Amex)",
      days: "10 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Cabal)",
      days: "18 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Visa - Master-Argencard)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description:
        "No Bancarizadas (Naranja Visa, Naranja Master, Cencosud, etc)",
      days: "5 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description:
        "Recargables (Tarjetas de débito de bancos virtuales, Uala, Brubank, Mercadopago y todas las recargables)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 2 O MÁS PAGOS",
      description: "Bancarizadas (Amex - Cabal)",
      days: "10 días hábiles",
    },
    {
      category: "CRÉDITO 2 O MÁS PAGOS",
      description: "No Bancarizadas (Naranja Visa, Naranja Master, Cencosud)",
      days: "5 días hábiles",
    },
    {
      category: "CRÉDITO CUOTA SIMPLE",
      description:
        "Solo Bancarizadas habilitadas (Bancos Nacionales, Provinciales y Privados)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO CUOTA SIMPLE",
      description: "Solo bancarizadas habilitadas (Amex)",
      days: "10 días hábiles",
    },
    {
      category: "FECHA DE PAGO",
      description: "Naranja",
      days: "Cierre: 24 cada mes - Pago 14",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.headerText]} numberOfLines={1}>
          Categoría
        </Text>
        <Text style={[styles.cell, styles.headerText]} numberOfLines={1}>
          Descripción
        </Text>
        <Text style={[styles.cell, styles.headerText]} numberOfLines={1}>
          Plazos de Acreditación
        </Text>
      </View>

      {/* Body */}
      {data.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={[styles.cell, styles.text]}>{row.category}</Text>
          <Text style={[styles.cell, styles.text]}>{row.description}</Text>
          <Text
            style={[
              styles.cell,
              styles.textBold,
              row.days.includes("48 hs") ? { color: "#b4c400" } : {},
            ]}
          >
            {row.days}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
