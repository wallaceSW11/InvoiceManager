<template>
  <v-text-field
    :model-value="formattedValue"
    @update:model-value="handleInput"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :hint="hint"
    :persistent-hint="persistentHint"
    @focus="handleFocus"
    @click="handleClick"
    inputmode="decimal"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: number | null
  label?: string
  rules?: any[]
  disabled?: boolean
  hint?: string
  persistentHint?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  label: '',
  rules: () => [],
  disabled: false,
  hint: '',
  persistentHint: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const formattedValue = ref('R$ 0,00')

function formatMoney(value: number): string {
  const absValue = Math.abs(value)
  const formatted = absValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return value < 0 ? '-R$ ' + formatted : 'R$ ' + formatted
}

function parseMoneyInput(input: string): number {
  // Verifica se é negativo
  const isNegative = input.includes('-')
  
  // Remove tudo exceto números
  const numbers = input.replace(/\D/g, '')
  if (!numbers) return 0
  
  // Converte para número (últimos 2 dígitos são centavos)
  const value = parseInt(numbers) / 100
  return isNegative ? -value : value
}

function handleInput(value: string) {
  const numericValue = parseMoneyInput(value)
  formattedValue.value = formatMoney(numericValue)
  emit('update:modelValue', numericValue)
}

function handleFocus(event: FocusEvent) {
  const input = event.target as HTMLInputElement
  nextTick(() => {
    input.setSelectionRange(input.value.length, input.value.length)
  })
}

function handleClick(event: MouseEvent) {
  const input = event.target as HTMLInputElement
  nextTick(() => {
    input.setSelectionRange(input.value.length, input.value.length)
  })
}

// Atualiza o valor formatado quando o modelValue muda
watch(() => props.modelValue, (newVal) => {
  const value = newVal ?? 0
  formattedValue.value = formatMoney(value)
}, { immediate: true })
</script>

<style scoped>
:deep(input) {
  text-align: right;
}
</style>
