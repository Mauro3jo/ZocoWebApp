import { StyleSheet } from "react-native";

const TABBAR_HEIGHT = 64;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  tabbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E3E6EE",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },

  tabbar: {
    height: TABBAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔹 Contenedor del título y botones
  toggleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },

  // 🔹 Título "SIMULADOR"
  title: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#141517",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // 🔹 Fila de botones
  toggleButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  // 🔹 Botones más finos, tipo pastilla
  toggleButton: {
    minWidth: 90,
    paddingVertical: 6, // 🔥 más fino
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleActive: {
    backgroundColor: "#B1C20E",
  },

  toggleInactive: {
    backgroundColor: "#E3E6EE",
  },

  toggleTextActive: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },

  toggleTextInactive: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
    color: "#5A5D61",
  },
});
