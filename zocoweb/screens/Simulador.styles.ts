import { StyleSheet } from 'react-native';

const TABBAR_HEIGHT = 64;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  scroll: {
    flex: 1,
  },
  tabbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E3E6EE',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabbar: {
    height: TABBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 🔹 Toggle de simulador
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#B1C20E',
  },
  toggleInactive: {
    backgroundColor: '#E3E6EE',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
