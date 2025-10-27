# CSV Import and Invoice Splitting Implementation

## Overview
This document describes the implementation of CSV import functionality and invoice value splitting feature for the InvoiceManager app.

## Implemented Features

### 1. CSV Parser
**File:** `src/infrastructure/parsers/CSVParser.ts`

**Capabilities:**
- Parses CSV format: `DD/MM;DESCRIPTION;AMOUNT`
- Handles Brazilian date format (DD/MM → converts to full date)
- Handles comma decimal separator (16,83 → 16.83)
- Validates file type and size (max 5MB)
- Returns structured ParsedTransaction objects with error reporting

**Methods:**
- `parse(csvContent: string)`: Main parsing method
- `parseLine(line: string)`: Parses individual CSV line
- `parseDate(dateStr: string)`: Converts DD/MM to YYYY-MM-DD
- `parseAmount(amountStr: string)`: Converts comma decimal to number
- `validateFile(file: File)`: Validates file before processing
- `readFile(file: File)`: Promise wrapper for FileReader

**Example Usage:**
```typescript
const parser = new CSVParser()
const content = await parser.readFile(file)
const result = parser.parse(content)
// result: { transactions: ParsedTransaction[], errors: string[] }
```

### 2. Import Invoice Dialog
**File:** `src/presentation/components/ImportInvoiceDialog.vue`

**Features:**
- 2-step wizard interface
  - **Step 1:** Select card, due date, and CSV file
  - **Step 2:** Preview parsed transactions with total
- Real-time CSV validation
- Error display with detailed messages
- Transaction preview table with date, description, and amount
- Automatic navigation to invoice detail after import
- Full i18n support (pt-BR and en-US)

**Props:**
- `v-model`: Dialog visibility (boolean)

**Events:**
- `close`: Emitted when dialog is closed
- `imported`: Emitted with invoice ID when import succeeds

**Integration:**
```vue
<ImportInvoiceDialog 
  v-model="showDialog" 
  @imported="handleImported" 
/>
```

### 3. Invoice Detail & Splitting Screen
**File:** `src/presentation/views/InvoiceDetailView.vue`

**Features:**

#### Invoice Summary Card
- Displays card information (nickname + last 4 digits)
- Shows due date in Brazilian format
- Displays grand total in BRL currency

#### Participant Selection
- Chip group for selecting multiple participants
- "Split All Equally" button for quick equal division
- Visual feedback with outlined chips

#### Splitting Table
- Dynamic columns based on selected participants
- Each transaction row contains:
  - Date (DD/MM/YYYY format)
  - Description
  - Input field for each participant with:
    - Number input (step 0.01)
    - Check/uncheck icon for quick toggle
  - Total amount (read-only)
  - Auto-split button per transaction
- Footer row with totals per participant
- Visual validation (red background for invalid splits)
- Real-time calculation and validation

#### Smart Features
- **Auto-split per transaction:** Divides transaction equally among selected participants
- **Auto-split all:** Divides all transactions equally with one click
- **Toggle participant:** Click icon to include/exclude participant from specific transaction
- **Real-time validation:** Ensures split amounts match transaction total
- **Automatic initialization:** When participants are selected, automatically splits unsplit transactions
- **Precision handling:** Rounds to 2 decimals, ensures last participant gets remainder to match total exactly

#### Save Functionality
- Updates invoice with transaction splits
- Stores SplitMode (MANUAL)
- Only enabled when all transactions are valid
- Loading state during save

### 4. WhatsApp Message Generation
**File:** `src/presentation/views/InvoiceDetailView.vue`

**Features:**

#### Message Generation
- Generates personalized messages for each participant
- Message includes:
  - Greeting with participant name
  - Card identification (nickname + last digits)
  - Due date in Brazilian format
  - List of participant's transactions with dates and amounts
  - Total amount to pay

**Message Format Example:**
```
Olá João! 👋

Segue sua parte da fatura do cartão Nubank (*1234):
Vencimento: 31/10/2025

📋 *Suas compras:*
• 15/10/2025 - NETFLIX: R$ 45,90
• 20/10/2025 - UBER: R$ 32,50

💰 *Total: R$ 78,40*
```

#### WhatsApp Dialog
- Expansion panels for each participant with amounts > 0
- Shows participant name and total amount in header
- Read-only textarea with generated message
- Two action buttons per participant:
  - **Copy:** Copies message to clipboard with feedback
  - **Send on WhatsApp:** Opens WhatsApp Web/App with pre-filled message

#### Integration
- "Generate Messages" button appears after valid splits
- Opens modal with all participant messages
- Filters out participants with zero amounts
- Direct WhatsApp integration using `wa.me` API

### 5. Translations

#### Portuguese (pt-BR)
```typescript
invoice: {
  import: {
    title: 'Importar Fatura',
    step1: 'Selecionar Arquivo',
    step2: 'Visualizar',
    selectCard: 'Selecione o Cartão',
    dueDate: 'Data de Vencimento',
    selectFile: 'Selecione o arquivo CSV',
    parseErrors: 'Erros ao processar arquivo:',
    // ... more keys
  },
  split: {
    selectParticipants: 'Selecione os Participantes',
    autoSplitAll: 'Dividir Tudo Igualmente',
    totals: 'Totais',
    noParticipantsSelected: 'Selecione os participantes...'
  },
  whatsapp: {
    title: 'Mensagens WhatsApp',
    generate: 'Gerar Mensagens',
    copy: 'Copiar',
    copied: 'Copiado!',
    send: 'Enviar no WhatsApp'
  }
}
```

#### English (en-US)
- Complete parallel translation for all keys
- Maintains same structure as pt-BR

### 6. Home View Integration
**File:** `src/presentation/views/HomeView.vue`

**Changes:**
- Added "Import Invoice" button to quick actions
- Integrated ImportInvoiceDialog component
- Handles post-import navigation to invoice detail

## User Workflow

### Complete Flow
1. **Create Cards and Participants** (if not done)
   - Navigate to Cards → Add credit cards
   - Navigate to Participants → Add family members with phone numbers

2. **Import Invoice**
   - Click "Import Invoice" on Home or navigation
   - Select card and due date
   - Upload CSV file in format: `DD/MM;DESCRIPTION;AMOUNT`
   - Preview transactions (automatic validation)
   - Click "Import"
   - Automatically redirected to invoice detail

3. **Split Values**
   - Select participants using chips
   - Use "Split All Equally" for quick equal division, OR
   - Manually adjust values per participant per transaction, OR
   - Click calculator icon on specific transactions for auto-split
   - Toggle participant inclusion with check/uncheck icons
   - Verify totals in footer row
   - Click "Save" when all splits are valid

4. **Generate WhatsApp Messages**
   - Click "Generate Messages" button
   - Review personalized message for each participant
   - For each participant:
     - Click "Copy" to copy message to clipboard, OR
     - Click "Send on WhatsApp" to open WhatsApp with pre-filled message

## Technical Details

### Type Safety
- Full TypeScript strict mode compliance
- Proper null/undefined handling
- Type-safe entity interfaces

### Data Persistence
- LocalStorage through repository pattern
- Easy migration path to API
- Automatic serialization/deserialization

### Validation
- File type validation (CSV only)
- File size validation (max 5MB)
- CSV format validation
- Split amount validation (must match transaction total)
- Date format validation (DD/MM)
- Amount format validation (comma decimal separator)

### Architecture
- Clean Architecture principles
- Separation of concerns (domain/infrastructure/presentation)
- Repository pattern for data access
- Composable stores with Pinia
- Component composition

## File Structure
```
src/
├── core/
│   └── domain/
│       ├── entities/
│       │   ├── Invoice.ts
│       │   ├── Transaction.ts
│       │   └── TransactionSplit.ts
│       └── enums/
│           └── SplitMode.ts
├── infrastructure/
│   └── parsers/
│       ├── CSVParser.ts
│       └── index.ts
└── presentation/
    ├── components/
    │   └── ImportInvoiceDialog.vue
    ├── views/
    │   ├── HomeView.vue
    │   └── InvoiceDetailView.vue
    └── i18n/
        └── locales/
            ├── pt-BR.ts
            └── en-US.ts
```

## Performance Considerations
- File size limit (5MB) prevents browser memory issues
- Efficient split calculations with memoization
- Optimized re-renders with Vue's reactivity
- LocalStorage chunking for large datasets

## Browser Compatibility
- Modern browsers (ES2020+)
- Clipboard API support required for copy functionality
- FileReader API for CSV parsing
- WhatsApp Web integration (`wa.me` links)

## Future Enhancements
- CSV export functionality
- Multiple file import
- Split templates/presets
- History of sent messages
- Email integration
- Custom message templates
- Batch WhatsApp sending
