<template>
  <ModalBase v-model="isOpen" :title="currentTitle" :message="currentMessage" :actions="dialogActions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalBase, { type ModalAction } from '../modals/ModalBase.vue'

const isOpen = ref(false)
const currentTitle = ref('')
const currentMessage = ref('')
let resolvePromise: ((value: boolean) => void) | null = null

const dialogActions: ModalAction[] = [
  {
    text: 'No',
    color: 'grey',
    variant: 'text',
    handler: () => {
      if (resolvePromise) resolvePromise(false)
    },
  },
  {
    text: 'Yes',
    color: 'primary',
    variant: 'elevated',
    handler: () => {
      if (resolvePromise) resolvePromise(true)
    },
  },
]

const ConfirmDialog = (title: string, message: string): Promise<boolean> => {
  currentTitle.value = title
  currentMessage.value = message
  isOpen.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

defineExpose({
  ConfirmDialog,
})
</script>
