import { StyleSheet } from "react-native";

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#141517",
  },

  closeBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "transparent",
  },

  closeBtnText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Montserrat_700Bold",
  },

  form: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: "Montserrat_700Bold",
    color: "#141517",
  },

  // 🔹 Inputs y selects con fondo gris, bordes redondeados y sin línea de borde
  input: {
    backgroundColor: "#F4F6FA",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#141517",
    marginBottom: 14,
  },

  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  selectInput: {
    backgroundColor: "#F4F6FA",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  selectPlaceholder: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },

  selectValue: {
    color: "#141517",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },

  row: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  col: {
    flex: 1,
  },

  footerRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  // 🔹 Botón “Guardar” verde con bordes redondeados
  btn: {
    width: "100%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B4C400",
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },

  // 🔹 Select modal
  selectBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },

  selectSheet: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    maxHeight: "70%",
  },

  selectTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 10,
    color: "#141517",
  },

  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  optionText: {
    fontSize: 15,
    color: "#141517",
    fontFamily: "Montserrat_400Regular",
  },
});
