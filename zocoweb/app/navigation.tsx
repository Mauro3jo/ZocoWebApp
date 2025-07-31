import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import IntroZoco from '../screens/IntroZoco';

export type RootStackParamList = {
  IntroZoco: undefined;
  Welcome: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IntroZoco" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IntroZoco" component={IntroZoco} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
