import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface ThemeConfig {
  name: string;
  version: string;
  logo: {
    light: string;
    dark: string;
    favicon: string;
  };
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  fonts: {
    primary: string;
    monospace: string;
  };
  customization: {
    appName: string;
    appDescription: string;
    copyrightText: string;
  };
}

export const useThemeStore = defineStore("theme", () => {
  const themeConfig = ref<ThemeConfig | null>(null);
  const isDark = ref(false);
  const isLoading = ref(true);

  const currentMode = computed(() => (isDark.value ? "dark" : "light"));
  const currentLogo = computed(
    () => themeConfig.value?.logo[currentMode.value] || ""
  );
  const currentColors = computed(
    () => themeConfig.value?.colors[currentMode.value] || {}
  );
  const appName = computed(
    () => themeConfig.value?.customization.appName || "Vue3 Base"
  );

  function loadSavedThemePreference() {
    const savedTheme = localStorage.getItem("app-theme");
    isDark.value = savedTheme === "dark";
  }

  function applyThemeToVuetify() {
    if (!themeConfig.value) return;

    const html = document.documentElement;
    html.setAttribute("data-theme", currentMode.value);

    window.dispatchEvent(
      new CustomEvent("theme-changed", {
        detail: {
          mode: currentMode.value,
          colors: currentColors.value,
        },
      })
    );
  }

  async function loadTheme() {
    try {
      isLoading.value = true;
      const response = await fetch("/theme.json");
      if (!response.ok) {
        throw new Error("Failed to load theme configuration");
      }
      themeConfig.value = await response.json();

      loadSavedThemePreference();
      applyThemeToVuetify();
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem("app-theme", currentMode.value);
    applyThemeToVuetify();
  }

  function setTheme(mode: "light" | "dark") {
    isDark.value = mode === "dark";
    localStorage.setItem("app-theme", mode);
    applyThemeToVuetify();
  }

  function updateThemeColors(colors: Record<string, string>) {
    if (!themeConfig.value) return;

    themeConfig.value.colors[currentMode.value] = {
      ...themeConfig.value.colors[currentMode.value],
      ...colors,
    };
    applyThemeToVuetify();
  }

  return {
    themeConfig,
    isDark,
    isLoading,
    currentMode,
    currentLogo,
    currentColors,
    appName,
    loadTheme,
    toggleTheme,
    setTheme,
    updateThemeColors,
  };
});
