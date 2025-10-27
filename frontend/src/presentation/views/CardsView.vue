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

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editingCard ? t('cards.edit') : t('cards.new') }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="form.nickname"
              :label="t('cards.nickname')"
              :rules="[
                v => !!v || t('cards.validation.nicknameRequired'),
                v => v.length <= 15 || t('cards.validation.nicknameTooLong')
              ]"
              maxlength="15"
              counter
              required
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" :disabled="!formValid" @click="saveCard">
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardStore } from '@/presentation/stores/cardStore'
import type { Card } from '@/core/domain/entities'

const { t } = useI18n()
const cardStore = useCardStore()

const headers = computed(() => [
  { title: t('cards.nickname'), key: 'nickname' },
  { title: t('cards.lastDigits'), key: 'lastFourDigits' },
  { title: t('common.actions'), key: 'actions', sortable: false }
])

const dialog = ref(false)
const formValid = ref(false)
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

function closeDialog() {
  dialog.value = false
  editingCard.value = null
  form.value = {
    nickname: '',
    lastFourDigits: ''
  }
}

async function saveCard() {
  if (!formValid.value) return

  try {
    if (editingCard.value) {
      await cardStore.updateCard(editingCard.value.id, form.value)
    } else {
      await cardStore.createCard(form.value)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving card:', error)
  }
}

async function confirmDelete(card: Card) {
  if (confirm(t('cards.deleteConfirm', { nickname: card.nickname }))) {
    try {
      await cardStore.deleteCard(card.id)
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }
}
</script>
