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
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 12,
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

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#141517",
  },

  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  selectBox: {
    marginBottom: 12,
  },

  hint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    marginLeft: 4,
    fontFamily: "Montserrat_300Light",
  },

  hintSmall: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    marginLeft: 4,
    fontFamily: "Montserrat_300Light",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },

  col: {
    flex: 1,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  btn: {
    minWidth: 130,
    height: 44,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  btnCancel: {
    backgroundColor: "#141517",
  },

  btnSave: {
    backgroundColor: "#B4C400",
  },

  btnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },

  /* -------- Select estilo modal -------- */
  selectInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
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

  selectBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },

  selectSheet: {
    backgroundColor: "#fff",
    borderRadius: 20,
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
