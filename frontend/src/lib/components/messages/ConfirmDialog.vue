<template>
  <ModalBase v-model="isOpen" :title="currentTitle" :message="currentMessage" :actions="dialogActions" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalBase, { type ModalAction } from '../modals/ModalBase.vue'

const { t } = useI18n()

const isOpen = ref(false)
const currentTitle = ref('')
const currentMessage = ref('')
let resolvePromise: ((value: boolean) => void) | null = null

const dialogActions = computed<ModalAction[]>(() => [
  {
    text: t('common.yes'),
    color: 'primary',
    variant: 'elevated',
    handler: () => {
      if (resolvePromise) resolvePromise(true)
    },
  },
  {
    text: t('common.no'),
    color: 'grey',
    variant: 'text',
    handler: () => {
      if (resolvePromise) resolvePromise(false)
    },
  },
])

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
