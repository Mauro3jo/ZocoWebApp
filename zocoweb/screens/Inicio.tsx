import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Inicio() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Icon name="arrow-left" size={22} color="#B1C20E" />
      </TouchableOpacity>
      <Text style={styles.title}>Inicio</Text>
    </View>
  );
}
