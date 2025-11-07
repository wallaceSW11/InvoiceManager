<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ t('participants.title') }}</span>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
          {{ t('common.add') }}
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
      :actions="modalActions"
      max-width="500"
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
import { ModalBase, useGlobals } from '@wallacesw11/base-lib'
import type { ModalAction } from '@wallacesw11/base-lib'

const { t } = useI18n()
const participantStore = useParticipantStore()
const { formatPhone, unformatPhone, validatePhone } = usePhoneMask()
const { notify, confirm } = useGlobals()

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

const modalActions = computed((): ModalAction[] => [
  {
    text: t('common.save'),
    color: 'primary',
    variant: 'elevated',
    icon: 'mdi-content-save',
    handler: saveParticipant
  },
  {
    text: t('common.cancel'),
    color: 'grey',
    variant: 'text',
    handler: () => { dialog.value = false }
  }
])

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
      notify.success(t('participants.messages.updated'))
      dialog.value = false
      editingParticipant.value = null
    } else {
      await participantStore.createParticipant({
        ...form.value,
        phoneNumber: cleanPhone
      })
      notify.success(t('participants.messages.created'))
      form.value = { name: '', phoneNumber: '' }
      formRef.value?.resetValidation()
      nextTick(() => {
        nameFieldRef.value?.focus()
      })
    }
  } catch (error) {
    console.error('Error saving participant:', error)
    notify.error(t('participants.messages.error'))
  }
}

async function confirmDelete(participant: Participant) {
  const confirmed = await confirm.show(
    t('participants.deleteConfirm', { name: participant.name }),
    t('common.confirmDelete')
  )
  
  if (confirmed) {
    try {
      await participantStore.deleteParticipant(participant.id)
      notify.success(t('participants.messages.deleted'))
    } catch (error) {
      console.error('Error deleting participant:', error)
      notify.error(t('participants.messages.error'))
    }
  }
}
</script>
