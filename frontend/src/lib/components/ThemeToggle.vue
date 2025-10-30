<template>
  <v-btn :icon="icon" @click="toggleTheme" :title="buttonTitle" variant="text">
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@lib/stores/theme";

const themeStore = useThemeStore();

const icon = computed(() =>
  themeStore.isDark ? "mdi-weather-sunny" : "mdi-weather-night"
);

const buttonTitle = computed(() =>
  themeStore.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
);

function toggleTheme() {
  themeStore.toggleTheme();
}
</script>
