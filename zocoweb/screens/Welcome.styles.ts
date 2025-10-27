import { StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  container: { flex: 1 },
  video: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  // Z arriba izquierda
  logoZ: {
    position: "absolute",
    top: height * 0.03, // sube un poco
    left: width * 0.08,
  },

  // Texto principal
  textWrapper: {
    position: "absolute",
    top: height * 0.15,
    left: width * 0.08,
  },
  textLine1: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 36,
    color: colors.blanco,
    lineHeight: 40,
  },
  textLine2: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 36,
    color: colors.blanco,
    lineHeight: 40,
  },
  textLine3: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 56,
    color: colors.blanco,
    lineHeight: 58,
    marginTop: 2,
  },

  // Área verde
  footerSection: {
    backgroundColor: colors.verdeZoco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 25,
    paddingHorizontal: 30,
    height: height * 0.27,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  huellaButton: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ Footer fijo abajo, sin chocar con huella
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
});
