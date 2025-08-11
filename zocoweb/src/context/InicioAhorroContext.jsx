import React, { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_INICIO_AHORRO, REACT_APP_API_TOKEN } from '@env';

export const InicioAhorroContext = createContext(null);

export const InicioAhorroProvider = ({ children }) => {
  const [datosInicioAhorro, setDatosInicioAhorro] = useState(null);
  const [tokenValido, setTokenValido] = useState(false);

  const obtenerToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch {
      return null;
    }
  }, []);

  const verificarToken = useCallback(async () => {
    const token = await obtenerToken();
    if (!token) {
      setTokenValido(false);
      return;
    }
    try {
      const resp = await fetch(REACT_APP_API_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Token: token }),
      });
      // backend devuelve 0 cuando está ok
      const data = await resp.json();
      setTokenValido(data === 0);
    } catch (e) {
      setTokenValido(false);
    }
  }, [obtenerToken]);

  const fetchDatosInicioAhorro = useCallback(async () => {
    const token = await obtenerToken();
    if (!token) return;
    try {
      const resp = await fetch(REACT_APP_API_INICIO_AHORRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Token: token }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setDatosInicioAhorro(data);
      } else {
        setDatosInicioAhorro(null);
      }
    } catch (e) {
      setDatosInicioAhorro(null);
    }
  }, [obtenerToken]);

  // verificar al montar
  useEffect(() => {
    verificarToken();
  }, [verificarToken]);

  // si el token es válido, cargo datos
  useEffect(() => {
    if (tokenValido) fetchDatosInicioAhorro();
  }, [tokenValido, fetchDatosInicioAhorro]);

  // desestructuro con defaults
  const {
    ahorroMercadoPago = null,
    ahorroPayway = null,
    porcentajeAhorroMercadoPago = null,
    porcentajeAhorroPayway = null,
    ahorroNaranjaX = null,
    porcentajeAhorroNaranjaX = null,
    ahorroGetnet = null,
    porcentajeAhorroGetnet = null,
    ahorroViumi = null,
    porcentajeAhorroViumi = null,
    ahorroNave = null,
    porcentajeAhorroNave = null,
    netoZoco = null,
  } = datosInicioAhorro || {};

  return (
    <InicioAhorroContext.Provider
      value={{
        tokenValido,
        ahorroMercadoPago,
        ahorroPayway,
        porcentajeAhorroMercadoPago,
        porcentajeAhorroPayway,
        ahorroNaranjaX,
        porcentajeAhorroNaranjaX,
        ahorroGetnet,
        porcentajeAhorroGetnet,
        ahorroViumi,
        porcentajeAhorroViumi,
        ahorroNave,
        porcentajeAhorroNave,
        netoZoco,
        fetchDatosInicioAhorro, // por si querés refrescar manual
      }}
    >
      {children}
    </InicioAhorroContext.Provider>
  );
};
