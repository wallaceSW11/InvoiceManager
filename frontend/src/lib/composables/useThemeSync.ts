import { watch, onMounted } from "vue";
import { useTheme as useVuetifyTheme } from "vuetify";
import { useThemeStore } from "@lib/stores/theme";

export function useThemeSync() {
  const themeStore = useThemeStore();
  const vuetifyTheme = useVuetifyTheme();

  function applyColorsToVuetify() {
    if (!themeStore.themeConfig) return;

    const colors = themeStore.currentColors;
    const theme = vuetifyTheme.themes.value[themeStore.currentMode];
    if (!theme) return;

    Object.keys(colors).forEach((key) => {
      const colorValue = colors[key];
      if (colorValue !== undefined) {
        theme.colors[key] = colorValue;
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
