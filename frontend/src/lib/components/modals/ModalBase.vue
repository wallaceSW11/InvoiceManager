<template>
  <v-dialog v-model="isOpen" :max-width="maxWidth" persistent>
    <v-card>
      <v-card-title v-if="title" class="text-h5">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot>
          {{ message }}
        </slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-for="(action, index) in actions"
          :key="index"
          :color="action.color || 'primary'"
          :prepend-icon="action.icon"
          :variant="action.variant || 'text'"
          @click="handleAction(action)"
        >
          {{ action.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface ModalAction {
  text: string
  icon?: string
  color?: string
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  handler?: () => void | Promise<void>
}

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  maxWidth?: string | number
  actions?: ModalAction[]
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  message: '',
  maxWidth: 500,
  actions: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleAction = async (action: ModalAction) => {
  if (action.handler) {
    await action.handler()
  }
  isOpen.value = false
  emit('close')
}
</script>
