<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ t('cards.title') }}</span>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
          {{ t('cards.add') }}
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cardStore.cards"
          :loading="cardStore.loading"
        >
          <template #item.lastFourDigits="{ item }">
            **** {{ item.lastFourDigits }}
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
      :title="editingCard ? t('cards.edit') : t('cards.new')"
      :primary-button-text="t('common.save')"
      :secondary-button-text="t('common.cancel')"
      :disable-primary-button="!formValid"
      max-width="500"
      :primary-action="saveCard"
    >
      <v-form ref="formRef" v-model="formValid">
        <v-text-field
          ref="nicknameFieldRef"
          v-model="form.nickname"
          :label="t('cards.nickname')"
          :rules="[
            v => !!v || t('cards.validation.nicknameRequired'),
            v => v.length <= 15 || t('cards.validation.nicknameTooLong')
          ]"
          maxlength="15"
          counter
          required
          :autofocus="!editingCard"
        />
        <v-text-field
          v-model="form.lastFourDigits"
          :label="t('cards.lastFourDigits')"
          :rules="[
            v => !!v || t('cards.validation.lastDigitsRequired'),
            v => /^\d{4}$/.test(v) || t('cards.validation.lastDigitsInvalid')
          ]"
          maxlength="4"
          required
        />
      </v-form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardStore } from '@/presentation/stores/cardStore'
import type { Card } from '@/core/domain/entities'
import ModalBase from '@/presentation/components/ModalBase.vue'
import { useGlobals } from '@lib'

const { t } = useI18n()
const cardStore = useCardStore()
const { notify } = useGlobals()

const headers = computed(() => [
  { title: t('cards.nickname'), key: 'nickname' },
  { title: t('cards.lastDigits'), key: 'lastFourDigits' },
  { title: t('common.actions'), key: 'actions', sortable: false }
])

const dialog = ref(false)
const formValid = ref(false)
const formRef = ref<any>(null)
const nicknameFieldRef = ref<any>(null)
const editingCard = ref<Card | null>(null)
const form = ref({
  nickname: '',
  lastFourDigits: ''
})

onMounted(() => {
  cardStore.fetchCards()
})

function openDialog(card?: Card) {
  if (card) {
    editingCard.value = card
    form.value = {
      nickname: card.nickname,
      lastFourDigits: card.lastFourDigits
    }
  } else {
    editingCard.value = null
    form.value = {
      nickname: '',
      lastFourDigits: ''
    }
  }
  dialog.value = true
}

async function saveCard() {
  if (!formValid.value) return

  try {
    if (editingCard.value) {
      await cardStore.updateCard(editingCard.value.id, form.value)
      notify('success', t('common.success'), t('cards.messages.updated'))
      // Em edição, fecha o modal
      dialog.value = false
      editingCard.value = null
    } else {
      await cardStore.createCard(form.value)
      notify('success', t('common.success'), t('cards.messages.created'))
      // Em novo cadastro, mantém o modal aberto e limpa os campos
      form.value = { nickname: '', lastFourDigits: '' }
      formRef.value?.resetValidation()
      // Retorna o foco para o primeiro campo
      nextTick(() => {
        nicknameFieldRef.value?.focus()
      })
    }
  } catch (error) {
    console.error('Error saving card:', error)
    notify('error', t('common.error'), t('cards.messages.error'))
  }
}

async function confirmDelete(card: Card) {
  if (confirm(t('cards.deleteConfirm', { nickname: card.nickname }))) {
    try {
      await cardStore.deleteCard(card.id)
      notify('success', t('common.success'), t('cards.messages.deleted'))
    } catch (error) {
      console.error('Error deleting card:', error)
      notify('error', t('common.error'), t('cards.messages.error'))
    }
  }
}
</script>
