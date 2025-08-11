import React from 'react';
import AppNavigation from './app/navigation';
import { DatosInicioProvider } from './src/context/DatosInicioContext'; // ajustá la ruta real

export default function App() {
  return (
    <DatosInicioProvider>
      <AppNavigation />
    </DatosInicioProvider>
  );
}
