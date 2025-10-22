// src/context/DatosInicioContext.jsx
import React, { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  REACT_APP_API_INICIO,
  REACT_APP_API_CONTABILIDAD,
  REACT_APP_API_ANALISIS,
  REACT_APP_API_CUPONES,
  REACT_APP_API_TOKEN,
  REACT_APP_API_NO_HAY_DATOS,
} from "@env";

export const DatosInicioContext = createContext(null);

export const DatosInicioProvider = ({ children }) => {
  const [datosBackContext, setDatosBackContext] = useState({});
  const [codigoRespuesta, setCodigoRespuesta] = useState(null);
  const [datos, setDatos] = useState(null);
  const [datosMandados, setDatosMandados] = useState();
  const [datosContabilidadContext, setDatosContabilidadContext] = useState({});
  const [datosAnalisisContext, setDatosAnalisisContext] = useState({});
  const [datosCuponesContext, setDatosCuponesContext] = useState({});
  const [datosFiltrado, setdatosfiltrados] = useState({});
  const [noHayDatos, setNoHayDatos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modoLogin, setModoLogin] = useState(false); // 👈 nueva flag

  const lastLoadKeyRef = useRef("");

  const actualizarDatos = (nuevosDatos) => setDatos(nuevosDatos);

  const obtenerToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch {
      return null;
    }
  };

  const obtenerNoHayDatos = async () => {
    const token = await obtenerToken();
    if (!token) return true;
    try {
      const resp = await fetch(REACT_APP_API_NO_HAY_DATOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Token: token }),
      });
      if (resp.ok) {
        const val = await resp.json();
        setNoHayDatos(val);
        return val;
      }
    } catch {}
    return true;
  };

  const baseRequestData = async (forzarDefault = false) => {
    const token = await obtenerToken();
    const currentDate = new Date();

    // 👇 si venimos desde login, ignoramos datos previos
    const year = forzarDefault
      ? currentDate.getFullYear()
      : datos?.anio || currentDate.getFullYear();
    const month = forzarDefault
      ? currentDate.getMonth() + 1
      : datos?.mes || currentDate.getMonth() + 1;
    const week = forzarDefault
      ? Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)
      : datos?.semana || Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7);
    const comercio = forzarDefault ? "Todos" : datos?.comercio || "Todos";
    const day = 1;

    return { token, year, month, week, comercio, day };
  };

  // === loaders ===
  const cargarDatosInicio = async (forzarDefault = false) => {
    try {
      const requestData = await baseRequestData(forzarDefault);
      const response = await fetch(REACT_APP_API_INICIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const data = await response.json();
        setCodigoRespuesta(200);
        setDatosBackContext(data);
        return true;
      } else {
        setCodigoRespuesta(response.status);
        console.error("Error Inicio:", response.status);
        return false;
      }
    } catch (e) {
      console.error("Error Inicio:", e);
      return false;
    }
  };

  const cargarDatosContabilidad = async (forzarDefault = false) => {
    try {
      const requestData = await baseRequestData(forzarDefault);
      const response = await fetch(REACT_APP_API_CONTABILIDAD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (response.status === 200) {
        const data = await response.json();
        setDatosContabilidadContext(data);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error Contabilidad:", e);
      return false;
    }
  };

  const cargarDatosAnalisis = async (forzarDefault = false) => {
    try {
      const requestData = await baseRequestData(forzarDefault);
      const response = await fetch(REACT_APP_API_ANALISIS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (response.status === 200) {
        const data = await response.json();
        setDatosAnalisisContext(data);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error Análisis:", e);
      return false;
    }
  };

  const cargarDatosCupones = async (forzarDefault = false) => {
    try {
      const requestData = await baseRequestData(forzarDefault);
      const response = await fetch(REACT_APP_API_CUPONES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        const data = await response.json();
        setDatosCuponesContext(data);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error Cupones:", e);
      return false;
    }
  };

  // 🔁 Refresco manual que detecta si venimos del login
  const refreshAll = async (forzarDesdeLogin = false) => {
    setLoading(true);
    try {
      const ok = await Promise.all([
        cargarDatosInicio(forzarDesdeLogin),
        cargarDatosContabilidad(forzarDesdeLogin),
        cargarDatosAnalisis(forzarDesdeLogin),
        cargarDatosCupones(forzarDesdeLogin),
      ]);

      const todoOK = ok.every((r) => r === true);
      if (todoOK) {
        console.log("✅ Datos cargados correctamente");
      } else {
        console.log("⚠️ Algunos endpoints devolvieron error");
      }
      return todoOK;
    } finally {
      setLoading(false);
      if (forzarDesdeLogin) setModoLogin(false);
    }
  };

  // === supervisor automático ===
  useEffect(() => {
    if (modoLogin) return; // 👈 si venimos de login, no auto-cargar todavía

    const verificarYcargarDatos = async () => {
      const token = await obtenerToken();
      if (!token) return;

      try {
        const resp = await fetch(REACT_APP_API_TOKEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!resp.ok) return;
        const data = await resp.json(); // backend: 0 == OK
        obtenerNoHayDatos();

        if (data === 0) {
          const key = JSON.stringify({ datos, filtro: datosFiltrado });
          if (datos === null || key !== lastLoadKeyRef.current) {
            await refreshAll();
            setdatosfiltrados(datos);
            lastLoadKeyRef.current = key;
          }
        }
      } catch {}
    };

    verificarYcargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(datos)]);

  return (
    <DatosInicioContext.Provider
      value={{
        datos,
        actualizarDatos,
        datosBackContext,
        setDatosBackContext,
        datosCuponesContext,
        datosMandados,
        setDatosMandados,
        datosContabilidadContext,
        setDatosContabilidadContext,
        datosAnalisisContext,
        setDatosAnalisisContext,
        codigoRespuesta,
        noHayDatos,
        refreshAll,
        loading,
        setModoLogin, // 👈 agregamos este setter
      }}
    >
      {children}
    </DatosInicioContext.Provider>
  );
};
