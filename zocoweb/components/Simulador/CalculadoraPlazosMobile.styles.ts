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
    fontFamily: "Montserrat_700Bold",
    marginVertical: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "#dde1e8",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: "#000",
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
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  hint: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    fontFamily: "Montserrat_400Regular",
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
    fontFamily: "Montserrat_600SemiBold",
    color: "#000",
  },
  resultDate: {
    fontSize: 24,
    textAlign: "center",
    color: "#b4c400",
    marginBottom: 16,
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
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 4,
  },
  bold: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
  },
  green: {
    color: "#b4c400",
    fontFamily: "Montserrat_700Bold",
  },
  alert: {
    marginTop: 20,
    fontSize: 12,
    color: "red",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
  noData: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    fontFamily: "Montserrat_400Regular",
  },
});
