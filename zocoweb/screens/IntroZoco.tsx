import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Z from '../assets/svg/Z.svg';
import O from '../assets/svg/O.svg';
import C from '../assets/svg/C.svg';

const { width } = Dimensions.get('window');

const Iconos = [Z, O, C, O];

const IntroZoco = () => {
  const navigation = useNavigation();
  const animations = useRef(Iconos.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const secuencia = Iconos.map((_, i) =>
      Animated.timing(animations[i], {
        toValue: 1,
        duration: 500,         // animación más suave
        delay: i * 100,        // menos delay entre letras
        useNativeDriver: true,
      })
    );

    Animated.sequence(secuencia).start(() => {
      setTimeout(() => {
        navigation.replace('Welcome');
      }, 300); // transición más rápida
    });
  }, []);

  return (
    <View style={styles.container}>
      {Iconos.map((Icono, i) => (
        <Animated.View
          key={i}
          style={[
            styles.iconoContainer,
            {
              opacity: animations[i],
              transform: [
                {
                  translateY: animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Icono
            width={64}
            height={64}
            {...(i === 0 ? {} : { color: '#FFFFFF' })}
          />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconoContainer: {
    marginHorizontal: 8,
  },
});

export default IntroZoco;
