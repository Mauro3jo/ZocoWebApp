import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import IntroZoco from "../screens/IntroZoco";
import Inicio from "../screens/Inicio";
import MenuPrincipal from "../screens/MenuPrincipal";
import Contabilidad from "../screens/Contabilidad";
import Analisis from "../screens/Analisis";
import Cupones from "../screens/Cupones";
import Consultas from "../screens/Consultas";
import Calificar from "../screens/Calificar";
import Simulador from "../screens/Simulador";

export type RootStackParamList = {
  IntroZoco: undefined;
  Welcome: undefined;
  Login: undefined;
  Inicio: undefined;
  MenuPrincipal: undefined;
  Contabilidad: undefined;
  Analisis: undefined;
  Cupones: undefined;
  Consultas: undefined;
  Calificar: undefined;
  Simulador: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IntroZoco" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IntroZoco" component={IntroZoco} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="MenuPrincipal" component={MenuPrincipal} />
        <Stack.Screen name="Contabilidad" component={Contabilidad} />
        <Stack.Screen name="Analisis" component={Analisis} />
        <Stack.Screen name="Cupones" component={Cupones} />
        <Stack.Screen name="Consultas" component={Consultas} />
        <Stack.Screen name="Calificar" component={Calificar} />
        <Stack.Screen name="Simulador" component={Simulador} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
