import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
  text: string;
}

export default function Boton({ onPress, text }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
