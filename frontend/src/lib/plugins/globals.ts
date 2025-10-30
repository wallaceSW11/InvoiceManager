import type { App } from "vue";
import { notify } from "../utils/notify";
import { loading } from "../utils/loading";
import { confirm } from "../utils/confirm";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $notify: typeof notify;
    $loading: typeof loading;
    $confirm: typeof confirm;
  }
}

export default {
  install(app: App) {
    app.config.globalProperties.$notify = notify;
    app.config.globalProperties.$loading = loading;
    app.config.globalProperties.$confirm = confirm;
  },
};
