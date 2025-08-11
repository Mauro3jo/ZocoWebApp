// src/context/DarkModeContext.jsx
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: (_v) => {},
});

const STORAGE_KEY = 'darkMode'; // guarda un booleano en AsyncStorage

export function DarkModeProvider({ children }) {
  // tema del sistema: 'dark' | 'light' | null
  const systemScheme = useColorScheme();
  // default: lo que diga el sistema
  const [darkMode, setDarkMode] = useState(systemScheme === 'dark');

  // cargar preferencia persistida (si existe)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setDarkMode(JSON.parse(saved)); // 'true' | 'false'
        } else {
          setDarkMode(systemScheme === 'dark');
        }
      } catch {
        setDarkMode(systemScheme === 'dark');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar

  // guardar cuando cambia
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(darkMode)).catch(() => {});
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((v) => !v);
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
