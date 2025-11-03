import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  separatorTop: {
    height: 12,
    backgroundColor: "#F4F6FA",
    width: "100%",
  },

  titulo: {
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
    fontSize: 17,
    color: "#292B2F",
    marginTop: 14,
    marginBottom: 8, // más cerca del botón
  },

  newBtnRow: {
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },

  // 🔹 BOTÓN NUEVA — recto, más chico, sin bordes ni redondeos
btnNuevaConsulta: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#B1C20E",
  width: 120,       // más angosto
  height: 34,       // más fino
  borderRadius: 10, // 🔥 redondeado (antes estaba en 0)
  borderWidth: 0,   // sin borde visible
  paddingHorizontal: 4,
},


  btnNuevaConsultaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    marginLeft: 4, // espacio entre el ícono y el texto
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  loadingText: {
    marginTop: 8,
    fontFamily: "Montserrat_400Regular",
    color: "#292B2F",
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  cardLeft: {
    flex: 1,
    paddingRight: 8,
    justifyContent: "center",
  },

  separatorVertical: {
    width: 1,
    height: "80%",
    borderRightWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    alignSelf: "center",
  },

  cardRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardMotivo: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 13,
    color: "#292B2F",
    marginBottom: 2,
  },

  cardDireccion: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#292B2F",
    textTransform: "capitalize",
  },

  estadoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  cardEstado: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
  },

  estadoPendiente: {
    color: "#E53935",
  },

  estadoCompletado: {
    color: "#B1C20E",
  },

  cardFecha: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 11,
    color: "#9CA3AF",
  },
});
