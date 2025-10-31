import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotifyStore = defineStore("notify", () => {
  const notifyRef = ref<any>(null);

  const setNotifyRef = (ref: any) => {
    notifyRef.value = ref;
  };

  const notify = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message?: string
  ) => {
    if (notifyRef.value) {
      notifyRef.value.show(type, title, message);
    }
  };

  return {
    setNotifyRef,
    notify,
  };
});

export const notify = (
  type: "success" | "error" | "warning" | "info",
  title: string,
  message?: string
) => {
  const store = useNotifyStore();
  store.notify(type, title, message);
};
