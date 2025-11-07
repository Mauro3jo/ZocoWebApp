import axios from "axios";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  REACT_APP_API_NOTIFICACIONES_QR,
  REACT_APP_API_NOTIFICACIONES_NARANJA,
  REACT_APP_API_NOTIFICACIONES_COMUNES,
  REACT_APP_API_NOTIFICACIONES,
} from "@env";

/**
 * Ejecuta el ciclo de notificaciones inteligentes de Zoco.
 * Se ejecuta cada 5 minutos después de las 9:00 AM.
 */
export async function ejecutarNotificacionesZoco() {
  const cuit = await AsyncStorage.getItem("Usuario");
  if (!cuit) return;

  const ahora = new Date();
  const hora = ahora.getHours();
  if (hora < 9) return; // solo después de las 9 AM

  try {
    // ✅ 1️⃣ NOTICIAS DEL DÍA (desde REACT_APP_API_NOTIFICACIONES)
    const fechaHoy = ahora.toISOString().split("T")[0];
    const claveNoticias = `${fechaHoy}-noticias`;

    const yaMostroNoticias = await AsyncStorage.getItem(claveNoticias);
    if (!yaMostroNoticias) {
      const noticias = await axios.get(REACT_APP_API_NOTIFICACIONES);
      const noticiasAliadosHoy = noticias.data?.filter?.(
        (n: any) =>
          n.tipoUsuario?.trim()?.toLowerCase() === "aliado" &&
          esHoy(n.fecha)
      );

      if (noticiasAliadosHoy?.length > 0) {
        await notificar(
          "📰 Zoco - Nueva comunicación",
          "Tenés nuevas noticias o avisos del día."
        );
        await AsyncStorage.setItem(claveNoticias, "true");
        console.log("✅ Noticias de hoy notificadas. Fin del ciclo.");
        return;
      } else {
        console.log("🔄 No hay noticias nuevas para hoy. Continuando con pagos...");
      }
    }

    // ✅ 2️⃣ PAGOS COMUNES
    const fechaComunes = calcularFechaHabilSiguiente(ahora);
    const fechaClaveComunes = `${fechaComunes.toISOString().split("T")[0]}-comunes`;
    const yaMostradaComunes = await AsyncStorage.getItem(fechaClaveComunes);

    if (!yaMostradaComunes) {
      const comunes = await axios.get(`${REACT_APP_API_NOTIFICACIONES_COMUNES}?cuit=${cuit}`);
      if (comunes.data === true) {
        await notificar("💰 Zoco - Pagos Comunes", "Se acreditaron pagos comunes.");
        await AsyncStorage.setItem(fechaClaveComunes, "true");
        console.log("✅ Pagos comunes encontrados. Fin del ciclo.");
        return;
      } else {
        console.log("🔄 Sin pagos comunes. Intentando QR...");
      }
    }

    // ✅ 3️⃣ PAGOS QR (solo día actual)
    const fechaHoyClave = `${ahora.toISOString().split("T")[0]}-qr`;
    const yaMostradaQR = await AsyncStorage.getItem(fechaHoyClave);
    if (!yaMostradaQR) {
      const qr = await axios.get(`${REACT_APP_API_NOTIFICACIONES_QR}?cuit=${cuit}`);
      if (qr.data === true) {
        await notificar("💳 Zoco - Pagos QR", "Pagos QR acreditados hoy.");
        await AsyncStorage.setItem(fechaHoyClave, "true");
        console.log("✅ Pagos QR encontrados. Fin del ciclo.");
        return;
      } else {
        console.log("🔄 Sin pagos QR. Verificando Naranja...");
      }
    }

    // ✅ 4️⃣ PAGOS NARANJA (solo entre 12 y 14 o lunes siguiente)
    const dia = ahora.getDate();
    const mes = ahora.getMonth();
    const esFinde = ahora.getDay() === 0 || ahora.getDay() === 6;
    const yaMostradaNaranja = await AsyncStorage.getItem(`naranja-${mes}`);

    if (!yaMostradaNaranja && (dia >= 12 && (dia <= 14 || esFinde))) {
      const naranja = await axios.get(`${REACT_APP_API_NOTIFICACIONES_NARANJA}?cuit=${cuit}`);
      if (naranja.data === true) {
        await notificar("🟧 Zoco - Tarjeta Naranja", "Pagos de Tarjeta Naranja acreditados.");
        await AsyncStorage.setItem(`naranja-${mes}`, "true");
        console.log("✅ Pagos Naranja encontrados y guardados para este mes.");
        return;
      }
    }

    console.log("🕒 Fin del ciclo de notificaciones. Próxima ejecución en 5 minutos.");
  } catch (error) {
    console.warn("❌ Error verificando notificaciones:", error);
  }
}

/**
 * Notifica localmente en el celular.
 */
async function notificar(titulo: string, cuerpo: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

/**
 * Calcula el próximo día hábil, saltando fines de semana.
 */
function calcularFechaHabilSiguiente(fechaBase: Date): Date {
  let fecha = new Date(fechaBase);
  do {
    fecha.setDate(fecha.getDate() + 1);
  } while (fecha.getDay() === 0 || fecha.getDay() === 6);
  return fecha;
}

/**
 * Devuelve true si la fecha dada es hoy.
 */
function esHoy(fechaString: string) {
  const f = new Date(fechaString);
  const hoy = new Date();
  return (
    f.getDate() === hoy.getDate() &&
    f.getMonth() === hoy.getMonth() &&
    f.getFullYear() === hoy.getFullYear()
  );
}
