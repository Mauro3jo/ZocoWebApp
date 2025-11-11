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
 * 🔔 Ejecuta el ciclo de notificaciones inteligentes de Zoco.
 * Se ejecuta automáticamente cada 5 minutos (si la app está abierta o en segundo plano).
 */
export async function ejecutarNotificacionesZoco() {
  const cuit = await AsyncStorage.getItem("Usuario");
  if (!cuit) return;

  const ahora = new Date();
  const hora = ahora.getHours();

  // ⏰ Solo después de las 9 AM
  if (hora < 9) return;

  try {
    // ============================================================
    // 📰 1️⃣ NOTICIAS DEL DÍA (REACT_APP_API_NOTIFICACIONES)
    // ============================================================
    const fechaHoy = ahora.toISOString().split("T")[0];
    const claveNoticias = `${fechaHoy}-noticias`;

    const yaMostroNoticias = await AsyncStorage.getItem(claveNoticias);
    if (!yaMostroNoticias) {
      const noticias = await axios.get(REACT_APP_API_NOTIFICACIONES);
      const noticiasAliadosHoy = noticias.data?.filter?.(
        (n: any) =>
          n.tipoUsuario?.trim()?.toLowerCase() === "aliado" && esHoy(n.fecha)
      );

      if (noticiasAliadosHoy?.length > 0) {
        await notificar(
          "📰 Zoco - Nueva comunicación",
          "Tenés nuevas noticias o avisos del día."
        );
        await AsyncStorage.setItem(claveNoticias, "true");
        console.log("✅ Noticias de hoy notificadas.");
        return;
      } else {
        console.log("🔄 No hay noticias nuevas para hoy. Verificando pagos...");
      }
    }

    // ============================================================
    // 💰 2️⃣ PAGOS COMUNES
    // ============================================================
    const fechaComunes = calcularFechaHabilSiguiente(ahora);
    const claveComunes = `${fechaComunes.toISOString().split("T")[0]}-comunes`;

    const yaMostroComunes = await AsyncStorage.getItem(claveComunes);
    if (!yaMostroComunes) {
      const comunes = await axios.get(
        `${REACT_APP_API_NOTIFICACIONES_COMUNES}?cuit=${cuit}`
      );
      if (comunes.data === true) {
        await notificar("💰 Zoco - Pagos Comunes", "Se acreditaron pagos comunes.");
        await AsyncStorage.setItem(claveComunes, "true");
        console.log("✅ Pagos comunes encontrados.");
        return;
      } else {
        console.log("🔄 Sin pagos comunes. Intentando QR...");
      }
    }

    // ============================================================
    // 💳 3️⃣ PAGOS QR (día actual)
    // ============================================================
    const claveQR = `${fechaHoy}-qr`;
    const yaMostroQR = await AsyncStorage.getItem(claveQR);
    if (!yaMostroQR) {
      const qr = await axios.get(
        `${REACT_APP_API_NOTIFICACIONES_QR}?cuit=${cuit}`
      );
      if (qr.data === true) {
        await notificar("💳 Zoco - Pagos QR", "Pagos QR acreditados hoy.");
        await AsyncStorage.setItem(claveQR, "true");
        console.log("✅ Pagos QR encontrados.");
        return;
      } else {
        console.log("🔄 Sin pagos QR. Verificando Naranja...");
      }
    }

    // ============================================================
    // 🟧 4️⃣ PAGOS NARANJA (entre 12 y 14 o lunes siguiente)
    // ============================================================
    const dia = ahora.getDate();
    const mes = ahora.getMonth();
    const esFinde = ahora.getDay() === 0 || ahora.getDay() === 6;
    const claveNaranja = `naranja-${mes}`;
    const yaMostroNaranja = await AsyncStorage.getItem(claveNaranja);

    if (!yaMostroNaranja && (dia >= 12 && (dia <= 14 || esFinde))) {
      const naranja = await axios.get(
        `${REACT_APP_API_NOTIFICACIONES_NARANJA}?cuit=${cuit}`
      );
      if (naranja.data === true) {
        await notificar(
          "🟧 Zoco - Tarjeta Naranja",
          "Pagos de Tarjeta Naranja acreditados."
        );
        await AsyncStorage.setItem(claveNaranja, "true");
        console.log("✅ Pagos Naranja encontrados y guardados para este mes.");
        return;
      } else {
        console.log("🔄 Sin pagos Naranja este ciclo.");
      }
    }

    console.log("🕒 Fin del ciclo de notificaciones. Próxima ejecución en 5 min.");
  } catch (error) {
    console.warn("❌ Error verificando notificaciones:", error);
  }
}

/**
 * 📢 Envía una notificación local
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
 * 📅 Calcula el siguiente día hábil (omite fines de semana)
 */
function calcularFechaHabilSiguiente(fechaBase: Date): Date {
  let fecha = new Date(fechaBase);
  do {
    fecha.setDate(fecha.getDate() + 1);
  } while (fecha.getDay() === 0 || fecha.getDay() === 6);
  return fecha;
}

/**
 * ✅ Devuelve true si la fecha dada es hoy
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
