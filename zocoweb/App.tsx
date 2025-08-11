import React from 'react';
import AppNavigation from './app/navigation';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { DatosInicioProvider } from './src/context/DatosInicioContext';
import { InicioAhorroProvider } from './src/context/InicioAhorroContext';

export default function App() {
  return (
    <DarkModeProvider>
      <DatosInicioProvider>
        <InicioAhorroProvider>
          <AppNavigation />
        </InicioAhorroProvider>
      </DatosInicioProvider>
    </DarkModeProvider>
  );
}
