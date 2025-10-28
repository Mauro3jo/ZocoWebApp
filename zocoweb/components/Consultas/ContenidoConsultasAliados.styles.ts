import { StyleSheet } from "react-native";

export default StyleSheet.create({
  newBtnRow: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 8,
  },

  btnNuevaConsulta: {
    width: 250,
    height: 49,
    backgroundColor: "#B4C400",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNuevaConsultaText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  cardContainer: {
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#292B2F",
    paddingHorizontal: 16,
    fontFamily: "Montserrat_400Regular",
  },
  bold: {
    fontFamily: "Montserrat_700Bold",
  },

  estado: {
    fontSize: 18,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 6,
  },
  estadoPendiente: {
    color: "#E89F2F",
  },
  estadoCompletado: {
    color: "#B4C400",
  },
  fecha: {
    fontSize: 12,
    color: "#b3b5bf",
    fontFamily: "Montserrat_300Light",
  },
});
