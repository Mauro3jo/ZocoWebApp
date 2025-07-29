import { StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/colors';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  header: {
    paddingTop: 40,
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    padding: 10,
    zIndex: 2,
  },

  backArrow: {
    fontSize: 24,
    color: '#B1C20E',
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },

  content: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    flexGrow: 1,
  },

  holaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10, // más a la izquierda pero no pegado
  },

  hola: {
    fontSize: 50,
    fontWeight: '300',
    color: '#000',
  },

  wave: {
    fontSize: 40,
    marginLeft: 8,
  },

  sub: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    marginBottom: 20,
  },

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 30,
    paddingBottom: 5,
    width: '100%',
  },

  icon: {
    fontSize: 18,
    color: '#B1C20E',
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  loginButton: {
    backgroundColor: '#B1C20E',
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    height: height * 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
});
