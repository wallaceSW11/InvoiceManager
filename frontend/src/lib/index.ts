import type { App } from "vue";
import * as componentExports from "./components";
import globalsPlugin from "./plugins";

export const components = componentExports;
export * from "./components";
export * from "./utils";
export * from "./composables";
export * from "./locales";
export { default as globalsPlugin } from "./plugins";

export default function registerLibComponents(app: App) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
}

export function registerLibPlugins(app: App) {
  app.use(globalsPlugin);
}

export function setupLib(app: App) {
  registerLibComponents(app);
  registerLibPlugins(app);
}
