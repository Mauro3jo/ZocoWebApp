import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { ejecutarNotificacionesZoco } from "./notificacionesInteligentes";

const TASK_NAME = "ZocoBackgroundNotifications";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await ejecutarNotificacionesZoco();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("❌ Error background fetch:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function iniciarBackgroundFetch() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.Status.Restricted || status === BackgroundFetch.Status.Denied) {
    console.log("⚠️ Background fetch no permitido por el sistema.");
    return;
  }

  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 5 * 60, // cada 5 minutos
    stopOnTerminate: false,  // ✅ sigue al cerrar app
    startOnBoot: true,       // ✅ se inicia al reiniciar el cel
  });

  console.log("✅ Background fetch de Zoco registrado.");
}
