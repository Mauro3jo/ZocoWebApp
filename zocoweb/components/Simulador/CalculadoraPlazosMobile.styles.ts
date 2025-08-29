import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 12,
  },
  pickerWrapper: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#b4c400",
    borderRadius: 25,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: "#f4f6fa",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 24,
    textAlign: "center",
    color: "#b4c400",
    marginBottom: 16,
    fontWeight: "bold",
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
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bold: {
    fontSize: 14,
    fontWeight: "bold",
  },
  green: {
    color: "#b4c400",
    fontWeight: "bold",
  },
  alert: {
    marginTop: 20,
    fontSize: 12,
    color: "red",
    textAlign: "center",
  },
  noData: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
});
