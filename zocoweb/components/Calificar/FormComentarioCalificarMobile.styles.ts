import { StyleSheet } from "react-native";

export default StyleSheet.create({
  starsCard: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginTop: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  starsCardLight: {
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 12,
  },
  textLight: { color: "#292B2F" },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starTouch: {
    marginHorizontal: 8,
  },

  copyBlock: {
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  copyTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 6,
  },
  copy: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },
  italic: {
    fontStyle: "italic",
    fontFamily: "Montserrat_300Light",
  },

  textarea: {
    width: "100%",
    minHeight: 140,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlignVertical: "top",
    marginTop: 8,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#000",
  },
  textareaLight: {
    backgroundColor: "#DDE1E8",
  },

  submitBtn: {
    width: "100%",
    height: 48,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  submitBtnEnabled: {
    backgroundColor: "#B4C400",
    borderWidth: 2,
    borderColor: "#B4C400",
  },
  submitBtnDisabled: {
    backgroundColor: "#D0D7E2",
    borderWidth: 2,
    borderColor: "#D0D7E2",
  },
  submitBtnPressed: {
    opacity: 0.9,
  },
  submitText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },
});
