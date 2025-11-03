import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // fondo blanco como todo el sistema
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  /* 🔹 Nueva fila para flecha + título */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 6,
  },

  /* 🔹 Flecha de volver */
  arrow: {
    fontSize: 22,
    color: "#141517",
    marginRight: 8,
    fontFamily: "Montserrat_600SemiBold",
  },

  title: {
    textAlign: "left",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: "#141517",
    marginVertical: 10,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Montserrat_400Regular",
    color: "#555",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: "Montserrat_400Regular",
    color: "#777",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  descripcion: {
    fontSize: 14,
    color: "#141517",
    fontFamily: "Montserrat_400Regular",
    marginBottom: 6,
  },
  fecha: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#B4C400",
  },
  separator: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: 10,
  },

  /* 🔹 estilos del menú inferior */
  tabbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  tabbar: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});
