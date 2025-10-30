import { watch, onMounted } from "vue";
import { useTheme as useVuetifyTheme } from "vuetify";
import { useThemeStore } from "@/stores/theme";

export function useThemeSync() {
  const themeStore = useThemeStore();
  const vuetifyTheme = useVuetifyTheme();

  function applyColorsToVuetify() {
    if (!themeStore.themeConfig) return;

    const colors = themeStore.currentColors;
    Object.keys(colors).forEach((key) => {
      if (vuetifyTheme.themes.value[themeStore.currentMode]) {
        vuetifyTheme.themes.value[themeStore.currentMode].colors[key] =
          colors[key];
      }
    });
  }

  function updateVuetifyThemeMode() {
    vuetifyTheme.change(themeStore.currentMode);
  }

  function syncTheme() {
    if (!themeStore.themeConfig) return;

    applyColorsToVuetify();
    updateVuetifyThemeMode();
  }

  onMounted(() => {
    syncTheme();
  });

  watch(
    () => themeStore.currentMode,
    () => {
      syncTheme();
    }
  );

  watch(
    () => themeStore.currentColors,
    () => {
      syncTheme();
    },
    { deep: true }
  );

  return {
    syncTheme,
  };
}
