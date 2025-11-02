import { StyleSheet } from "react-native";

const TABBAR_HEIGHT = 64;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // 🔥 blanco total
  },

  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF", // 🔥 también blanco
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
    minHeight: TABBAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
