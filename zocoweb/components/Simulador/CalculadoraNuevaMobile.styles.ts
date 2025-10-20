import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6FA",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#1C1C1C",
  },

  // ===== INPUT =====
  input: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },

  // ===== PICKER IGUAL AL INPUT =====
  pickerWrapper: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    marginBottom: 16,
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 12,
  },
  picker: {
    color: "#000",
    fontSize: 16,
    width: "100%",
  },

  // ===== SWITCH COBRAR / RECIBIR =====
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
    fontSize: 15,
    fontWeight: "500",
    marginRight: 6,
    color: "#2A2A2A",
  },

  // ===== BOTÓN =====
  btn: {
    backgroundColor: "#b4c400",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  // ===== RESULTADOS =====
  resultCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  textLeft: {
    fontSize: 14,
    color: "#333",
  },
  textRight: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  textRightBig: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  greenLeft: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b4c400",
  },
  greenRight: {
    fontSize: 20,
    fontWeight: "700",
    color: "#b4c400",
  },
});
