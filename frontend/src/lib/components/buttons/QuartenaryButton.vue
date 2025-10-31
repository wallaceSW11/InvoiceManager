<template>
  <v-btn :prepend-icon="icon" :disabled="disabled" color="warning" class="text-none" @click="handleClick">
    {{ text }}
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  text: '',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>
