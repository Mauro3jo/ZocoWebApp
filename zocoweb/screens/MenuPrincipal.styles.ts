import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const SIDE_MARGIN = width * 0.10; // 10% de ancho
const TOP_SPACER = height * 0.10; // 10% del alto

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSpacer: {
    height: TOP_SPACER,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 42,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  headerIcon: {
    width: 28,
    height: 28,
    marginHorizontal: 3,
  },
  dot: {
    position: 'absolute',
    top: 3,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#B1C20E',
  },
  menuList: {
    flex: 1,
    width: '100%',
  },
  menuListContent: {
    paddingBottom: 180, // deja suficiente espacio para el botón salir y el menú inferior
    paddingHorizontal: SIDE_MARGIN,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ecf0f5',
    backgroundColor: '#fff',
  },
  iconWrapper: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
    fontWeight: '500',
    textAlignVertical: 'center',
  },
  // Botón Salir ABSOLUTO Y SEPARADO DEL MENÚ INFERIOR
  exitButtonContainer: {
    position: 'absolute',
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
    bottom: 125, // Más arriba del menú inferior (ajusta si lo querés más arriba/abajo)
    zIndex: 200,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 13,
    justifyContent: 'center',
  },
  exitIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  exitLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 17,
  },
  menuBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 66,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    zIndex: 99,
    paddingHorizontal: SIDE_MARGIN,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBottomIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
