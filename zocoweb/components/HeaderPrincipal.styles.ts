import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Header
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  left: { flexDirection: "row", alignItems: "center" },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  rightButton: { padding: 5 },
  userIcon: { width: 24, height: 24, tintColor: "#000" },

  // Fondo transparente del modal
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // 🔹 Modal dinámico que aparece justo debajo del header
  modalContainer: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  arrowContainer: {
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 2,
  },
  modalContent: {
    alignItems: "center",
    paddingTop: 10,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    marginBottom: 4,
  },
  line: {
    width: "80%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  changePassButton: {
    paddingVertical: 8,
  },
  changePassText: {
    fontSize: 14,
    color: "#000",
  },

  // Formulario
  passwordForm: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 14,
  },
  formGroup: {
    width: "85%",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f5f7fb",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#B1C20E",
    paddingVertical: 10,
    borderRadius: 6,
    width: "85%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
