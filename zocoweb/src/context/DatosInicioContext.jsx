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
  // === estados ===
  const [datosBackContext, setDatosBackContext] = useState({});
  const [codigoRespuesta, setCodigoRespuesta] = useState(null);

  const [datos, setDatos] = useState(null);
  const [datosMandados, setDatosMandados] = useState();
  const [datosContabilidadContext, setDatosContabilidadContext] = useState({});
  const [datosAnalisisContext, setDatosAnalisisContext] = useState({});
  const [datosCuponesContext, setDatosCuponesContext] = useState({});
  const [datosFiltrado, setdatosfiltrados] = useState({});
  const [noHayDatos, setNoHayDatos] = useState(true);

  // loading general para cuando refrescamos todo (lo usa Login para esperar)
  const [loading, setLoading] = useState(false);

  // para evitar recargas repetidas
  const lastLoadKeyRef = useRef("");

  // === helpers base ===
  const actualizarDatos = (nuevosDatos) => setDatos(nuevosDatos);

  const obtenerToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch {
      return null;
    }
  };

  // consulta true/false para mostrar modal de datos (informativo)
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

  const baseRequestData = async () => {
    const token = await obtenerToken();
    const currentDate = new Date();
    const year = datos?.anio || currentDate.getFullYear();
    const month = datos?.mes || currentDate.getMonth() + 1;
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const dayOfWeek = firstDayOfMonth.getDay();
    const week =
      datos?.semana || Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
    const comercio = datos?.comercio || "Todos";
    const day = 1;

    return { token, year, month, week, comercio, day };
  };

  // === loaders ===
  const cargarDatosInicio = async () => {
    try {
      const requestData = await baseRequestData();
      const response = await fetch(REACT_APP_API_INICIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        setCodigoRespuesta(200);
        const data = await response.json();
        setDatosBackContext(data);
      } else if (response.status === 401) {
        setCodigoRespuesta(401);
        console.error("Usuario no autorizado");
      } else {
        setCodigoRespuesta(400);
        throw new Error("Error en la solicitud");
      }
    } catch (e) {
      console.error("Error Inicio:", e);
    }
  };

  const cargarDatosContabilidad = async () => {
    try {
      const requestData = await baseRequestData();
      const response = await fetch(REACT_APP_API_CONTABILIDAD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        setCodigoRespuesta(200);
        const data = await response.json();
        setDatosContabilidadContext(data);
      } else if (response.status === 401) {
        setCodigoRespuesta(401);
        console.error("Usuario no autorizado");
      } else {
        setCodigoRespuesta(400);
        throw new Error("Error en la solicitud");
      }
    } catch (e) {
      console.error("Error Contabilidad:", e);
    }
  };

  const cargarDatosAnalisis = async () => {
    try {
      const requestData = await baseRequestData();
      const response = await fetch(REACT_APP_API_ANALISIS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        setCodigoRespuesta(200);
        const data = await response.json();
        setDatosAnalisisContext(data);
      } else if (response.status === 401) {
        setCodigoRespuesta(401);
        console.error("Usuario no autorizado");
      } else {
        setCodigoRespuesta(400);
        throw new Error("Error en la solicitud");
      }
    } catch (e) {
      console.error("Error Análisis:", e);
    }
  };

  const cargarDatosCupones = async () => {
    try {
      const requestData = await baseRequestData();
      const response = await fetch(REACT_APP_API_CUPONES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setDatosCuponesContext(data);
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (e) {
      console.error("Error Cupones:", e);
    }
  };

  // 🔁 refresco manual para usar desde Login (espera a que terminen todas)
  const refreshAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarDatosInicio(),
        cargarDatosContabilidad(),
        cargarDatosAnalisis(),
        cargarDatosCupones(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // === supervisor (carga automática cuando hay token y cambian filtros) ===
  useEffect(() => {
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
        // Sólo informativo (no bloquea las cargas)
        obtenerNoHayDatos();

        if (data === 0) {
          const key = JSON.stringify({ datos, filtro: datosFiltrado });
          if (datos === null || key !== lastLoadKeyRef.current) {
            await refreshAll();
            setdatosfiltrados(datos);
            lastLoadKeyRef.current = key;
          }
        }
      } catch {
        // noop
      }
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
        refreshAll,      // ⬅️ para que Login espere
        loading,         // ⬅️ opcional, por si querés mostrar “Cargando…”
      }}
    >
      {children}
    </DatosInicioContext.Provider>
  );
};
