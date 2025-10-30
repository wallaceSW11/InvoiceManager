import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  const loadingRef = ref<any>(null);

  const setLoadingRef = (ref: any) => {
    loadingRef.value = ref;
  };

  const loading = (show: boolean, message?: string) => {
    if (loadingRef.value) {
      if (show) {
        loadingRef.value.show(message);
      } else {
        loadingRef.value.hide();
      }
    }
  };

  return {
    setLoadingRef,
    loading,
  };
});

export const loading = (show: boolean, message?: string) => {
  const store = useLoadingStore();
  store.loading(show, message);
};
