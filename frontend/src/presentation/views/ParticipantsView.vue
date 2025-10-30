<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ t('participants.title') }}</span>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
          {{ t('participants.add') }}
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="participantStore.participants"
          :loading="participantStore.loading"
        >
          <template #item.phoneNumber="{ item }">
            {{ formatPhone(item.phoneNumber) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn
              size="small"
              icon="mdi-pencil"
              variant="text"
              @click="openDialog(item)"
            />
            <v-btn
              size="small"
              icon="mdi-delete"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ModalBase
      v-model="dialog"
      :title="editingParticipant ? t('participants.edit') : t('participants.new')"
      :primary-button-text="t('common.save')"
      :secondary-button-text="t('common.cancel')"
      :disable-primary-button="!formValid"
      max-width="500"
      :primary-action="saveParticipant"
    >
      <v-form ref="formRef" v-model="formValid">
        <v-text-field
          ref="nameFieldRef"
          v-model="form.name"
          :label="t('participants.name')"
          :rules="[
            v => !!v || t('participants.validation.nameRequired'),
            v => v.length <= 20 || t('participants.validation.nameTooLong')
          ]"
          maxlength="20"
          counter
          required
          :autofocus="!editingParticipant"
        />
        <v-text-field
          v-model="form.phoneNumber"
          :label="t('participants.phoneNumber')"
          :rules="[
            v => !!v || t('participants.validation.phoneRequired'),
            v => validatePhone(v) || t('participants.validation.phoneInvalid')
          ]"
          @input="handlePhoneInput"
          placeholder="(00) 00000-0000"
          maxlength="15"
          required
        />
      </v-form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { usePhoneMask } from '@/presentation/composables/usePhoneMask'
import type { Participant } from '@/core/domain/entities'
import ModalBase from '@/presentation/components/ModalBase.vue'

const { t } = useI18n()
const participantStore = useParticipantStore()
const { formatPhone, unformatPhone, validatePhone } = usePhoneMask()

const headers = computed(() => [
  { title: t('participants.name'), key: 'name' },
  { title: t('participants.phoneNumber'), key: 'phoneNumber' },
  { title: t('common.actions'), key: 'actions', sortable: false }
])

const dialog = ref(false)
const formValid = ref(false)
const formRef = ref<any>(null)
const nameFieldRef = ref<any>(null)
const editingParticipant = ref<Participant | null>(null)
const form = ref({
  name: '',
  phoneNumber: ''
})

onMounted(() => {
  participantStore.fetchParticipants()
})

function openDialog(participant?: Participant) {
  if (participant) {
    editingParticipant.value = participant
    form.value = {
      name: participant.name,
      phoneNumber: formatPhone(participant.phoneNumber)
    }
  } else {
    editingParticipant.value = null
    form.value = {
      name: '',
      phoneNumber: ''
    }
  }
  dialog.value = true
}

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  const cursorPosition = input.selectionStart || 0
  const oldLength = form.value.phoneNumber.length
  
  form.value.phoneNumber = formatPhone(input.value)
  
  // Ajusta a posição do cursor após a formatação
  const newLength = form.value.phoneNumber.length
  const diff = newLength - oldLength
  
  requestAnimationFrame(() => {
    input.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
  })
}

async function saveParticipant() {
  if (!formValid.value) return

  try {
    const cleanPhone = unformatPhone(form.value.phoneNumber)
    if (editingParticipant.value) {
      await participantStore.updateParticipant(editingParticipant.value.id, {
        ...form.value,
        phoneNumber: cleanPhone
      })
      // Em edição, fecha o modal
      dialog.value = false
      editingParticipant.value = null
    } else {
      await participantStore.createParticipant({
        ...form.value,
        phoneNumber: cleanPhone
      })
      // Em novo cadastro, mantém o modal aberto e limpa os campos
      form.value = { name: '', phoneNumber: '' }
      formRef.value?.resetValidation()
      // Retorna o foco para o primeiro campo
      nextTick(() => {
        nameFieldRef.value?.focus()
      })
    }
  } catch (error) {
    console.error('Error saving participant:', error)
  }
}

async function confirmDelete(participant: Participant) {
  if (confirm(t('participants.deleteConfirm', { name: participant.name }))) {
    try {
      await participantStore.deleteParticipant(participant.id)
    } catch (error) {
      console.error('Error deleting participant:', error)
    }
  }
}
</script>
