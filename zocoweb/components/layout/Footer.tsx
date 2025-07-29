import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text?: string;
}

export default function Footer({ text }: Props) {
  if (!text) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.legal}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  legal: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});
