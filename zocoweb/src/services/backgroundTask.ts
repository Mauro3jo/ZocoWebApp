import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { ejecutarNotificacionesZoco } from "./notificacionesInteligentes";

const TASK_NAME = "ZocoBackgroundNotifications";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("🕒 Ejecutando notificaciones de fondo Zoco...");
    await ejecutarNotificacionesZoco();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("❌ Error en background fetch:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function iniciarBackgroundFetch() {
  try {
    const status = await BackgroundFetch.getStatusAsync();

    if (
      status === BackgroundFetch.Status.Restricted ||
      status === BackgroundFetch.Status.Denied
    ) {
      console.log("⚠️ Background fetch no permitido por el sistema.");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 5 * 60, // cada 5 min
        stopOnTerminate: false,
        startOnBoot: true
      });
      console.log("✅ Background fetch de Zoco registrado correctamente.");
    } else {
      console.log("ℹ️ Background fetch ya estaba registrado.");
    }
  } catch (err) {
    console.error("❌ Error registrando background fetch:", err);
  }
}
