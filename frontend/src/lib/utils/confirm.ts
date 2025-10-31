import { defineStore } from "pinia";
import type { ComponentPublicInstance } from "vue";

interface ConfirmDialogInstance {
  ConfirmDialog: (title: string, message: string) => Promise<boolean>;
}

export const useConfirmStore = defineStore("confirm", {
  state: () => ({
    confirmRef: null as ComponentPublicInstance | null,
  }),
  actions: {
    setConfirmRef(ref: ComponentPublicInstance) {
      this.confirmRef = ref;
    },
  },
});

export function confirm(title: string, message: string): Promise<boolean> {
  const store = useConfirmStore();
  const confirmInstance = store.confirmRef as ConfirmDialogInstance | null;

  if (!confirmInstance || !confirmInstance.ConfirmDialog) {
    console.error("ConfirmDialog component is not registered");
    return Promise.resolve(false);
  }

  return confirmInstance.ConfirmDialog(title, message);
}
