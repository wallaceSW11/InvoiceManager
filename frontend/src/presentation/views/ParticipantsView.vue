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
          v-model="form.name"
          :label="t('participants.name')"
          :rules="[
            v => !!v || t('participants.validation.nameRequired'),
            v => v.length <= 20 || t('participants.validation.nameTooLong')
          ]"
          maxlength="20"
          counter
          required
        />
        <v-text-field
          v-model="form.phoneNumber"
          :label="t('participants.phoneNumber')"
          :rules="[
            v => !!v || t('participants.validation.phoneRequired'),
            v => /^\d{10,11}$/.test(v.replace(/\D/g, '')) || t('participants.validation.phoneInvalid')
          ]"
          required
        />
      </v-form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import type { Participant } from '@/core/domain/entities'
import ModalBase from '@/presentation/components/ModalBase.vue'

const { t } = useI18n()
const participantStore = useParticipantStore()

const headers = computed(() => [
  { title: t('participants.name'), key: 'name' },
  { title: t('participants.phoneNumber'), key: 'phoneNumber' },
  { title: t('common.actions'), key: 'actions', sortable: false }
])

const dialog = ref(false)
const formValid = ref(false)
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
      phoneNumber: participant.phoneNumber
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

async function saveParticipant() {
  if (!formValid.value) return

  try {
    const cleanPhone = form.value.phoneNumber.replace(/\D/g, '')
    if (editingParticipant.value) {
      await participantStore.updateParticipant(editingParticipant.value.id, {
        ...form.value,
        phoneNumber: cleanPhone
      })
    } else {
      await participantStore.createParticipant({
        ...form.value,
        phoneNumber: cleanPhone
      })
    }
    dialog.value = false
    form.value = { name: '', phoneNumber: '' }
    editingParticipant.value = null
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
