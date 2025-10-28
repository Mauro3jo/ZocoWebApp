import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#d0d7e2",
  },
  header: {
    backgroundColor: "#292b2f",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },
  headerText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
  textBold: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
  },
});
