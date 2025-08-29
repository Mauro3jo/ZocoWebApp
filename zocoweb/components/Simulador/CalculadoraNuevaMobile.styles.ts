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
  },
  input: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    padding: 12,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  switchButton: {
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#292b2f",
  },
  switchActive: {
    backgroundColor: "#b4c400",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    marginVertical: 8,
  },
  btn: {
    backgroundColor: "#b4c400",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
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
