<template>
  <v-dialog
    v-model="isOpen"
    :min-width="minWidth"
    :max-width="maxWidth"
    :persistent="persistent"
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions class="pr-4 pb-4">
        <v-spacer />
        <v-btn
          v-if="showPrimaryButton"
          color="primary"
          :prepend-icon="primaryIcon"
          :disabled="disablePrimaryButton"
          @click="handlePrimaryAction"
        >
          {{ primaryButtonText }}
        </v-btn>
        <v-btn
          v-if="showSecondaryButton"
          color="secondary"
          :prepend-icon="secondaryIcon"
          :disabled="disableSecondaryButton"
          @click="handleSecondaryAction"
        >
          {{ secondaryButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  title: string
  primaryButtonText?: string
  secondaryButtonText?: string
  showPrimaryButton?: boolean
  showSecondaryButton?: boolean
  disablePrimaryButton?: boolean
  disableSecondaryButton?: boolean
  primaryAction?: (() => void) | null
  secondaryAction?: (() => void) | null
  minWidth?: string
  maxWidth?: string
  persistent?: boolean
  primaryIcon?: string
  secondaryIcon?: string
}

const isOpen = defineModel<boolean>({ default: false })

const props = withDefaults(defineProps<Props>(), {
  primaryButtonText: 'Salvar',
  secondaryButtonText: 'Cancelar',
  showPrimaryButton: true,
  showSecondaryButton: true,
  disablePrimaryButton: false,
  disableSecondaryButton: false,
  primaryAction: null,
  secondaryAction: null,
  minWidth: '600px',
  maxWidth: '800px',
  persistent: true,
  primaryIcon: 'mdi-content-save',
  secondaryIcon: 'mdi-cancel',
})

function handlePrimaryAction() {
  if (props.primaryAction) {
    props.primaryAction()
  }
}

function handleSecondaryAction() {
  if (props.secondaryAction) {
    props.secondaryAction()
  } else {
    isOpen.value = false
  }
}
</script>
