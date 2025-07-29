import { StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/colors';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1 },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textWrapper: {
    position: 'absolute',
    top: 80,
    left: 30,
  },
  textLine1: {
    fontSize: 24,
    color: colors.blanco,
    fontWeight: '300',
  },
  textLine2: {
    fontSize: 28,
    color: colors.blanco,
    fontWeight: '400',
  },
  textLine3: {
    fontSize: 36,
    color: colors.blanco,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    position: 'absolute',
    bottom: height * 0.30 + 30, // respeta proporción visual con el verde
  },
  footerSection: {
    backgroundColor: colors.verdeZoco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: height * 0.3, // 30% del alto total
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
footerAbsolute: {
  position: 'absolute',
  bottom: 30, // Subido para que no toque la navegación del celular
  width: '100%',
  alignItems: 'center',
},


});
