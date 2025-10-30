<template>
  <Transition name="slide-fade">
    <v-alert
      v-if="isVisible"
      :type="currentType"
      :title="currentTitle"
      :text="currentMessage"
      class="floating-notify"
      closable
      elevation="6"
      @click:close="hide"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type NotifyType = 'success' | 'error' | 'warning' | 'info'

const isVisible = ref(false)
const currentType = ref<NotifyType>('info')
const currentTitle = ref('')
const currentMessage = ref('')
let timeoutId: ReturnType<typeof setTimeout> | null = null

const show = (type: NotifyType, title: string, message: string) => {
  // Clear existing timeout if any
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  currentType.value = type
  currentTitle.value = title
  currentMessage.value = message
  isVisible.value = true

  // Auto-hide after 3 seconds
  timeoutId = setTimeout(() => {
    hide()
  }, 3000)
}

const hide = () => {
  isVisible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

defineExpose({
  show,
  hide,
})
</script>

<style scoped>
.floating-notify {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  z-index: 9999;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
