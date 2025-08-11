// src/context/DatosInicioContext.jsx
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_INICIO as REACT_APP_API_INICIO,
  API_CONTABILIDAD as REACT_APP_API_CONTABILIDAD,
  API_ANALISIS as REACT_APP_API_ANALISIS,
  API_CUPONES as REACT_APP_API_CUPONES,
  API_TOKEN as REACT_APP_API_TOKEN,
  API_NO_HAY_DATOS as REACT_APP_API_NO_HAY_DATOS,
} from "@env";

export const DatosInicioContext = createContext();

export const DatosInicioProvider = ({ children }) => {
  const [datosBackContext, setDatosBackContext] = useState({});
  const apiUrlInicio = REACT_APP_API_INICIO;
  const apiUrlContabilidad = REACT_APP_API_CONTABILIDAD;
  const apiUrlAnalisis = REACT_APP_API_ANALISIS;
  const apiUrlCupones = REACT_APP_API_CUPONES;
  const apiUrlToken = REACT_APP_API_TOKEN;
  const apiUrlNoHayDatos = REACT_APP_API_NO_HAY_DATOS;

  const [codigoRespuesta, setCodigoRespuesta] = useState(null);
  const [datos, setDatos] = useState(null);
  const [datosMandados, setDatosMandados] = useState();
  const [datosContabilidadContext, setDatosContabilidadContext] = useState({});
  const [datosAnalisisContext, setDatosAnalisisContext] = useState({});
  const [datosCuponesContext, setDatosCuponesContext] = useState({});
  const [datosFiltrado, setdatosfiltrados] = useState({});
  const [noHayDatos, setNoHayDatos] = useState(true);

  const actualizarDatos = (nuevosDatos) => setDatos(nuevosDatos);

  const obtenerToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const obtenerNoHayDatos = async () => {
    const token = await obtenerToken();
    if (!token) return;
    try {
      const response = await fetch(apiUrlNoHayDatos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Token: token }),
      });
      if (response.ok) {
        const resultado = await response.json();
        setNoHayDatos(resultado);
      }
    } catch {}
  };

  useEffect(() => {
    const verificarYcargarDatos = async () => {
      const token = await obtenerToken();
      if (!token) return;

      try {
        const resp = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!resp.ok) return;

        const data = await resp.json();
        await obtenerNoHayDatos();

        if (noHayDatos === true) {
          if (data === 0) {
            const debeCargar =
              datos === null ||
              JSON.stringify(datos) !== JSON.stringify(datosFiltrado);

            if (debeCargar) {
              await Promise.all([
                cargarDatosInicio(),
                cargarDatosContabilidad(),
                cargarDatosAnalisis(),
                cargarDatosCupones(),
              ]);
              setdatosfiltrados(datos);
            }
          }
        }
      } catch {}
    };

    const baseRequestData = async () => {
      const token = await obtenerToken();
      const currentDate = new Date();
      const year = datos?.anio ?? currentDate.getFullYear();
      const month = datos?.mes ?? currentDate.getMonth() + 1;
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      const week = datos?.semana ?? Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
      const comercio = datos?.comercio ?? "Todos";
      const day = 1;
      return { token, year, month, week, comercio, day };
    };

    const cargarDatosInicio = async () => {
      try {
        const requestData = await baseRequestData();
        const response = await fetch(apiUrlInicio, {
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
        const response = await fetch(apiUrlContabilidad, {
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
        const response = await fetch(apiUrlAnalisis, {
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
        const response = await fetch(apiUrlCupones, {
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

    verificarYcargarDatos();
    // sumo noHayDatos a deps para no quedar “stale”
  }, [datos, codigoRespuesta, noHayDatos]);

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
      }}
    >
      {children}
    </DatosInicioContext.Provider>
  );
};
