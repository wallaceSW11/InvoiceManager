# Reusable Library

Reusable components and utilities library for Vue 3 projects.

## 📦 How to use in a new project

### 1. Copy the `lib` folder

```bash
# Copy the entire src/lib folder to your new project
cp -r src/lib /path/to/new/project/src/
```

### 2. Configure Path Aliases

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@lib/*": ["./src/lib/*"],
      "@lib": ["./src/lib/index.ts"]
    }
  }
}
```

In `vite.config.ts`:

```typescript
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
});
```

### 3. Register in `main.ts`

```typescript
import { setupLib } from "@lib/index";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Pinia MUST come before setupLib
setupLib(app); // Registers components and global plugins
```

### 4. Use in components

```vue
<script setup lang="ts">
import { useGlobals } from "@lib/index";

const { notify, loading, confirm } = useGlobals();

// Use directly
notify("success", "Title", "Message");
loading(true, "Loading...");
const confirmed = await confirm("Title", "Message");
</script>

<template>
  <!-- Components already registered globally -->
  <PrimaryButton text="Click here" @click="handleClick" />
  <LoadingOverlay />
  <FloatingNotify />
</template>
```

## 📚 Library Content

### Global Components (Core - always work)

- **Buttons**: `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `QuartenaryButton`
- **Utilities**: `IconToolTip`
- **Modals**: `ModalBase`, `ConfirmDialog`
- **Messages**: `FloatingNotify`
- **Loading**: `LoadingOverlay`
- **Theme**: `ThemeToggle` - Theme switcher (requires theme.json)

### Optional Components (require external configuration)

⚠️ **This component requires external setup:**

- **`LanguageSelector`** - Requires project's locale configuration (has fallback)

> The `ThemeToggle` is now fully integrated in the lib and works out of the box if you have a `theme.json` in your project's `public/` folder.

### Utilities (Composables)

```typescript
import { useGlobals } from "@lib/index";
const { notify, loading, confirm } = useGlobals();
```

- **`notify(type, title, message)`** - Toast notifications
- **`loading(show, message?)`** - Loading overlay
- **`confirm(title, message)`** - Confirmation dialog (returns Promise<boolean>)
- **`useThemeSync()`** - Syncs theme.json with Vuetify theme

### Direct Imports (if preferred)

```typescript
import { notify, loading, confirm } from "@lib/utils";
import { useNotifyStore, useLoadingStore, useConfirmStore } from "@lib/utils";
import { useThemeStore } from "@lib/stores/theme";
```

## 🎯 Included Stores

- `useNotifyStore` - Manages notifications
- `useLoadingStore` - Manages loading states
- `useConfirmStore` - Manages confirmation dialogs
- `useThemeStore` - Manages theme configuration and mode (light/dark)

## ⚙️ Required Dependencies

Make sure your project has:

```json
{
  "dependencies": {
    "vue": "^3.x",
    "pinia": "^2.x",
    "vuetify": "^3.x"
  }
}
```

## 🔧 App.vue Configuration

For the utilities to work, you need to include the components in App.vue:

```vue
<template>
  <v-app>
    <!-- Your content -->
    <router-view />

    <!-- Required global components -->
    <FloatingNotify ref="floatingNotifyRef" />
    <LoadingOverlay ref="loadingOverlayRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNotifyStore, useLoadingStore, useConfirmStore } from "@lib/utils";

const floatingNotifyRef = ref();
const loadingOverlayRef = ref();
const confirmDialogRef = ref();

function registerGlobalComponentRefs() {
  const notifyStore = useNotifyStore();
  const loadingStore = useLoadingStore();
  const confirmStore = useConfirmStore();

  notifyStore.setNotifyRef(floatingNotifyRef.value);
  loadingStore.setLoadingRef(loadingOverlayRef.value);
  confirmStore.setConfirmRef(confirmDialogRef.value);
}

onMounted(registerGlobalComponentRefs);
</script>
```

## 📝 Important Notes

1. **Pinia** must be registered BEFORE `setupLib(app)`
2. **Vuetify** is required for components to work
3. Components are registered **globally** automatically
4. No need to import individual components, use them directly in templates
5. **i18n (Internationalization)**:
   - `ConfirmDialog` and `LoadingOverlay` use i18n for button labels and messages
   - Required translations in your project's locale files:
     ```typescript
     // locales/en-US.ts
     export default {
       common: {
         yes: "Yes",
         no: "No",
         loading: "Loading...",
       },
     };
     ```
   - If your project doesn't use i18n, the lib includes fallback translations in `lib/locales/`
   - `LanguageSelector` component automatically uses `lib/locales/` as fallback

## 🚀 Complete Example

```vue
<script setup lang="ts">
import { useGlobals } from "@lib/index";

const { notify, loading, confirm } = useGlobals();

async function handleDelete() {
  const confirmed = await confirm(
    "Confirm deletion",
    "Do you really want to delete?"
  );

  if (confirmed) {
    loading(true, "Deleting...");

    try {
      await api.delete("/item/123");
      notify("success", "Success!", "Item deleted");
    } catch (error) {
      notify("error", "Error!", "Failed to delete");
    } finally {
      loading(false);
    }
  }
}
</script>

<template>
  <PrimaryButton text="Delete" icon="mdi-delete" @click="handleDelete" />
</template>
```

## 📄 License

Free to use in your projects.
