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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  sheet: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    color: '#6f768a',
    fontWeight: '600',
  },
  linkMuted: {
    color: '#98a0b5',
    fontSize: 14,
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

  optionsList: {
    maxHeight: 220,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  opcionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcionItemSelected: {
    backgroundColor: '#f3f7ea',
  },
  opcionText: {
    color: '#30313A',
    fontSize: 14,
  },
  opcionTextSelected: {
    color: '#7d8d00',
    fontWeight: '600',
  },
  applyBtn: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef1f6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyText: {
    color: '#7d8d00',
    fontWeight: '700',
  },
  sep: {
    height: 6,
  },
});
