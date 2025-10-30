<template>
  <v-tooltip :text="text" location="top" :disabled="!text">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="asButton"
        v-bind="props"
        :icon="icon"
        variant="text"
      />
      <v-icon v-else v-bind="props">{{ icon }}</v-icon>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  text?: string
  asButton?: boolean
}

withDefaults(defineProps<Props>(), {
  text: undefined,
  asButton: false,
})
</script>
