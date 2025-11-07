import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 6,
    color: "#141517",
  },
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

  // 🔹 Wrapper para cada RNPickerSelect (evita errores visuales)
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

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginRight: 6,
    color: "#2A2A2A",
  },
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
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
  },
  resultCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  resultLabel: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  textLeft: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Montserrat_400Regular",
  },
  textRight: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000",
  },
  textRightBig: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 4,
  },
  greenLeft: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#B4C400",
  },
  greenRight: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#B4C400",
  },
});
