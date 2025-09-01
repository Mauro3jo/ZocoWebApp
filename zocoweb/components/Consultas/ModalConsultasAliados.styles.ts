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
    fontWeight: "700",
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
  },

  form: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  },
  hintSmall: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    marginLeft: 4,
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
    fontWeight: "700",
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
  },
  selectValue: {
    color: "#141517",
    fontSize: 14,
    fontWeight: "600",
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
    fontWeight: "700",
    marginBottom: 10,
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
  },
});
