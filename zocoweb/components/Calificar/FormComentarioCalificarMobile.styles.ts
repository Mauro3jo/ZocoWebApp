import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  starsCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB", // línea suave
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 22,
  },

  icon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginBottom: 12,
  },

  title: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Montserrat_400Regular",
    color: "#292B2F",
    textAlign: "center",
  },

  titleBold: {
    fontFamily: "Montserrat_700Bold",
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  starTouch: {
    marginHorizontal: 6,
  },

  copyBlock: {
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 8,
  },

  copyTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
    color: "#292B2F",
    textAlign: "center",
    marginBottom: 8,
  },

  copy: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#292B2F",
    textAlign: "center",
    lineHeight: 22,
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#000",
    marginBottom: 18,
  },

  submitBtn: {
    width: "100%",
    height: 42, // más fino
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B1C20E",
    marginBottom: 20,
  },

  submitBtnPressed: {
    opacity: 0.9,
  },

  submitText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
  },
});
