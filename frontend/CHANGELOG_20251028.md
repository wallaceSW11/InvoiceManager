# Changelog - Ajustes pós-deploy

## Data: 28/10/2025

### ✅ Implementações Concluídas

#### 1. PWA (Progressive Web App) Configurado
- **Instalação**: `vite-plugin-pwa` e `workbox-window`
- **Configuração**: `vite.config.ts` atualizado com configurações completas do PWA
- **Manifest**: `manifest.webmanifest` gerado automaticamente com:
  - Nome: "Invoice Manager"
  - Nome curto: "InvoiceManager"
  - Tema: #1976D2 (azul Material)
  - Ícones: 192x192 e 512x512 pixels
  - Modo: standalone
- **Service Worker**: Registrado automaticamente no `main.ts`
- **Cache**: Estratégia de cache configurada para fontes e assets
- **Ícones**: Gerados automaticamente via script `scripts/generate-icons.mjs`

**Resultado**: O app agora pode ser instalado como PWA no dispositivo do usuário e funciona offline!

#### 2. Máscara de Telefone
- **Formato**: `(xx) xxxxx-xxxx`
- **Composable**: Criado `usePhoneMask.ts` com funções:
  - `formatPhone()`: Formata número para exibição
  - `unformatPhone()`: Remove formatação para salvar
  - `validatePhone()`: Valida número (10 ou 11 dígitos)
- **Integração**: 
  - Campo de input com máscara automática
  - Exibição formatada na tabela de participantes
  - Validação integrada
  - Placeholder: "(00) 00000-0000"

**Resultado**: Melhor UX no cadastro de participantes com formatação automática do telefone!

#### 3. Informação de Formato CSV na Importação
- **Localização**: `ImportInvoiceDialog.vue`
- **Tipo**: Alert informativo (azul) antes do campo de erro
- **Conteúdo**:
  - Título: "Formato do arquivo:"
  - Descrição: "O arquivo deve conter 3 colunas separadas por ponto e vírgula (;):"
  - Exemplo visual:
    ```
    Data;Descrição;Valor
    11/09/2025;Teresopolis Shopping Center;121,89
    ```
- **i18n**: Traduções adicionadas em pt-BR e en-US

**Resultado**: Usuário sabe exatamente qual formato de arquivo enviar!

### 📦 Pacotes Adicionados
```json
{
  "vite-plugin-pwa": "^1.1.0",
  "workbox-window": "^7.3.0",
  "sharp": "^0.33.5" (dev - para gerar ícones)
}
```

### 🚀 Build
✅ Build realizado com sucesso
✅ Manifest gerado: `dist/manifest.webmanifest`
✅ Service Worker gerado: `dist/sw.js`
✅ Ícones PWA gerados: `icon-192x192.png` e `icon-512x512.png`

### 📝 Próximos Passos
1. Fazer deploy na Vercel
2. Testar instalação do PWA em dispositivo móvel
3. Verificar funcionamento offline
4. Testar máscara de telefone em diferentes navegadores
