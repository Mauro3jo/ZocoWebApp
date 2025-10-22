import { StyleSheet } from 'react-native';

export const HITSLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  text: { marginLeft: 8, fontSize: 15, color: '#8C91A5', flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    top: 180, // justo debajo del filtro bar
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  // 🔹 Header superior con ícono
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8C91A5',
  },

  divider: {
    height: 1,
    backgroundColor: '#eef1f6',
    marginBottom: 6,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eef1f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { color: '#6f768a', fontSize: 15, fontWeight: '600' },
  rowValue: { color: '#9aa0b4', fontSize: 14, marginRight: 6, maxWidth: 160 },
  optionsList: { maxHeight: 220, marginHorizontal: 6, marginBottom: 8 },
  opcionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcionItemSelected: { backgroundColor: '#f3f7ea' },
  opcionText: { color: '#30313A', fontSize: 14 },
  opcionTextSelected: { color: '#7d8d00', fontWeight: '600' },
  sep: { height: 6 },

  // 🔹 Barra inferior
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eef1f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 6,
  },
  bottomText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8C91A5',
  },
  bottomTextApply: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B1C20E',
  },
});
