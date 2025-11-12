<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">{{ t('cards.title') }}</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openDialog()"
      >
        {{ t('common.add') }}
      </v-btn>
    </div>

    <v-divider class="mb-4" />

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cardStore.cards"
          :loading="cardStore.loading"
          fixed-header
          height="calc(100dvh - 260px)"
        >
          <template #item.lastFourDigits="{ item }">**** {{ item.lastFourDigits }}</template>
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
          <template #no-data>
            {{ t('cards.noData') }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ModalBase
      v-model="dialog"
      :title="editingCard ? t('cards.edit') : t('cards.new')"
      :actions="modalActions"
      max-width="500"
      :fullscreen="isMobileOrTablet"
    >
      <v-form
        ref="formRef"
        v-model="formValid"
      >
        <v-text-field
          ref="nicknameFieldRef"
          v-model="form.nickname"
          :label="t('cards.nickname')"
          :rules="[
            (v) => !!v || t('cards.validation.nicknameRequired'),
            (v) => v.length <= 15 || t('cards.validation.nicknameTooLong')
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
            (v) => !!v || t('cards.validation.lastDigitsRequired'),
            (v) => /^\d{4}$/.test(v) || t('cards.validation.lastDigitsInvalid')
          ]"
          maxlength="4"
          required
        />
      </v-form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCardStore } from '@/presentation/stores/cardStore';
import type { Card } from '@/core/domain/entities';
import { ModalBase, useGlobals } from '@wallacesw11/base-lib';
import { useBreakpoint } from '@wallacesw11/base-lib/composables';
import type { ModalAction } from '@wallacesw11/base-lib';

const { t } = useI18n();
const cardStore = useCardStore();
const { notify, confirm } = useGlobals();
const { isMobileOrTablet } = useBreakpoint();

const headers = computed(() => [
  { title: t('cards.nickname'), key: 'nickname' },
  { title: t('cards.lastDigits'), key: 'lastFourDigits' },
  { title: t('common.actions'), key: 'actions', sortable: false, width: '120px' }
]);

const dialog = ref(false);
const formValid = ref(false);
const formRef = ref<any>(null);
const nicknameFieldRef = ref<any>(null);
const editingCard = ref<Card | null>(null);
const form = ref({
  nickname: '',
  lastFourDigits: ''
});

const modalActions = computed((): ModalAction[] => [
  {
    text: t('common.save'),
    color: 'primary',
    variant: 'elevated',
    icon: 'mdi-content-save',
    handler: saveCard as any
  },
  {
    text: t('common.cancel'),
    color: 'grey',
    variant: 'text',
    handler: () => {
      dialog.value = false;
    }
  }
]);

onMounted(() => {
  cardStore.fetchCards();
});

function openDialog(card?: Card) {
  if (card) {
    editingCard.value = card;
    form.value = {
      nickname: card.nickname,
      lastFourDigits: card.lastFourDigits
    };
  } else {
    editingCard.value = null;
    form.value = {
      nickname: '',
      lastFourDigits: ''
    };
  }
  dialog.value = true;
}

async function saveCard() {
  if (!formValid.value) return false;

  const isEditing = !!editingCard.value;

  try {
    if (isEditing) {
      await cardStore.updateCard(editingCard.value!.id, form.value);
      notify.success(t('cards.messages.updated'));
      editingCard.value = null;
      return true;
    } else {
      await cardStore.createCard(form.value);
      notify.success(t('cards.messages.created'));

      form.value = { nickname: '', lastFourDigits: '' };
      formRef.value?.reset();

      await nextTick();
      if (nicknameFieldRef.value) {
        nicknameFieldRef.value.focus();
      }
      return false;
    }
  } catch (error) {
    console.error('Error saving card:', error);
    notify.error(t('cards.messages.error'));
    return false;
  }
}

async function confirmDelete(card: Card) {
  const confirmed = await confirm.show(
    t('cards.deleteConfirm', { nickname: card.nickname }),
    t('common.confirmDelete')
  );

  if (confirmed) {
    try {
      await cardStore.deleteCard(card.id);
      notify.success(t('cards.messages.deleted'));
    } catch (error) {
      console.error('Error deleting card:', error);
      notify.error(t('cards.messages.error'));
    }
  }
}
</script>
