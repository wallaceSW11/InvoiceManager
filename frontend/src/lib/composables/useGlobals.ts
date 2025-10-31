import { getCurrentInstance } from "vue";
import type { notify as notifyFn } from "../utils/notify";
import type { loading as loadingFn } from "../utils/loading";
import type { confirm as confirmFn } from "../utils/confirm";

export function useGlobals() {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error("useGlobals must be called within setup()");
  }

  const { $notify, $loading, $confirm } = instance.proxy!;

  return {
    notify: $notify as typeof notifyFn,
    loading: $loading as typeof loadingFn,
    confirm: $confirm as typeof confirmFn,
  };
}
