import { StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },

  header: {
    paddingTop: 40,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
    padding: 10,
    zIndex: 2,
  },

  backArrow: {
    fontSize: 24,
    color: "#B1C20E",
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },

  content: {
    paddingHorizontal: 30,
    justifyContent: "center",
    flexGrow: 1,
  },

  holaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },

  hola: {
    fontSize: 50,
    fontWeight: "300",
    color: "#000",
  },

  holaImg: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },

  sub: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    marginBottom: 20,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 30,
    paddingBottom: 5,
    width: "100%",
  },

  iconImg: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#000",
  },

  icon: {
    fontSize: 18,
    color: "#B1C20E",
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdecea",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 22,
    marginBottom: 4,
    alignSelf: "stretch",
  },

  errorText: {
    color: "#e23d36",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    flexWrap: "wrap",
  },

  loginButton: {
    backgroundColor: "#B1C20E",
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  huellaButton: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    height: height * 0.3,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
});
