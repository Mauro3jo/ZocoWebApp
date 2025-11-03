import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  // 🔹 Tarjeta principal sin sombra
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0", // 🔹 leve borde gris muy claro
  },

  // 🔹 Label más fino
  label: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 6,
    color: "#141517",
  },

  // 🔹 Input rectangular con bordes suaves
  input: {
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#E3E6EE",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 14,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#000",
  },

  // 🔹 Picker igual que los input, con flecha
  pickerWrapper: {
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#E3E6EE",
    borderRadius: 10,
    marginBottom: 14,
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
  },

  // 🔹 Botón Calcular
  btn: {
    backgroundColor: "#B4C400",
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
  },

  // 🔹 Hint
  hint: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
  },

  // 🔹 Resultado sin sombra
  resultCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0", // 🔹 mismo borde claro que la card superior
  },

  resultTitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Montserrat_600SemiBold",
    color: "#141517",
  },
  resultDate: {
    fontSize: 22,
    textAlign: "center",
    color: "#B4C400",
    marginBottom: 14,
    fontFamily: "Montserrat_700Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 3,
    color: "#000",
  },
  bold: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: "#000",
  },
  green: {
    color: "#B4C400",
    fontFamily: "Montserrat_700Bold",
  },
  alert: {
    marginTop: 20,
    fontSize: 11,
    color: "red",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
  noData: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    fontFamily: "Montserrat_400Regular",
  },
});
