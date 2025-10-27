# 📋 Roadmap - InvoiceManager

## Project Architecture

### Folder Structure
```
src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── enums/
│   ├── usecases/
│   │   ├── card/
│   │   ├── participant/
│   │   ├── invoice/
│   │   └── transaction/
│   └── repositories/
│       └── interfaces/
├── infrastructure/
│   ├── repositories/
│   │   └── localstorage/
│   ├── parsers/
│   └── formatters/
├── presentation/
│   ├── views/
│   ├── components/
│   │   ├── common/
│   │   ├── card/
│   │   ├── participant/
│   │   └── invoice/
│   ├── composables/
│   ├── stores/
│   └── router/
├── shared/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   └── validators/
└── assets/

```

### Application Layers

#### 1. **Domain Layer (Core/Domain)**
- Entities: Pure business models (Card, Participant, Invoice, Transaction)
- Value Objects: Value objects (Money, PhoneNumber, CardNumber)
- Enums: Status, types, etc
- **Rule**: Zero external dependencies, pure business logic

#### 2. **Use Cases Layer (Core/UseCases)**
- Business-specific use cases
- Orchestration between repositories and domain
- Business rules validation
- **Example**: CreateCardUseCase, DivideInvoiceUseCase, GenerateWhatsAppMessageUseCase

#### 3. **Repository Interfaces (Core/Repositories)**
- Contracts (interfaces) for data access
- Implementation independent
- **Principle**: Dependency Inversion (SOLID)

#### 4. **Infrastructure Layer**
- Concrete implementations of repositories (LocalStorage)
- Parsers (CSV)
- Formatters (WhatsApp message, Currency)
- **Facilitates**: Switch LocalStorage to API in the future

#### 5. **Presentation Layer**
- Views (pages)
- Components (Vuetify)
- Stores (Pinia)
- Router
- **Responsibility**: UI and interaction only

---

## Development Phases

### **Phase 1: Setup and Foundation** ✅
1. Initialize project with Vite + Vue 3 + TypeScript
2. Configure Vuetify 3
3. Configure Vue Router
4. Configure Pinia
5. Configure ESLint + Prettier
6. Base folder structure

**Deliverable**: Running project with defined architecture

---

### **Phase 2: Domain Layer** 🎯
1. **Entities**:
   - `Card` (id, nickname, lastFourDigits, createdAt, updatedAt)
   - `Participant` (id, name, phoneNumber, createdAt, updatedAt)
   - `Invoice` (id, cardId, dueDate, totalAmount, status, transactions, createdAt)
   - `Transaction` (id, date, description, amount, splits)
   - `TransactionSplit` (participantId, amount)

2. **Value Objects**:
   - `Money` (currency validations, formatting)
   - `PhoneNumber` (validation, formatting)
   - `CardLastDigits` (4 digits validation)

3. **Enums**:
   - `InvoiceStatus` (OPEN, CLOSED, DRAFT)
   - `SplitMode` (MANUAL, EQUAL_DIVISION)

**Deliverable**: Complete and testable domain models

---

### **Phase 3: Repository Layer** 💾
1. **Interfaces** (core/repositories/interfaces):
   - `ICardRepository`
   - `IParticipantRepository`
   - `IInvoiceRepository`

2. **LocalStorage Implementations** (infrastructure/repositories):
   - `LocalStorageCardRepository`
   - `LocalStorageParticipantRepository`
   - `LocalStorageInvoiceRepository`

3. **Base Repository**:
   - Abstract class with generic CRUD
   - Serialization/deserialization
   - Error handling

**Deliverable**: Working persistence, easy to switch to API

---

### **Phase 4: Use Cases** 🔄
1. **Card Use Cases**:
   - CreateCard, UpdateCard, DeleteCard, ListCards, GetCard

2. **Participant Use Cases**:
   - CreateParticipant, UpdateParticipant, DeleteParticipant, ListParticipants

3. **Invoice Use Cases**:
   - ImportInvoiceFromCSV
   - SaveInvoiceDraft
   - UpdateTransactionSplit
   - CalculateTotalsByParticipant
   - CloseInvoice

4. **Export/Import Use Cases**:
   - ExportAllData
   - ImportAllData

**Deliverable**: Isolated and testable business logic

---

### **Phase 5: Infrastructure Services** 🛠️
1. **CSV Parser**:
   - Flexible interface for different formats
   - Data validations
   - Robust error handling

2. **WhatsApp Message Formatter**:
   - Message template
   - Value formatting
   - Grouping by participant

3. **Data Export/Import**:
   - JSON serialization
   - Integrity validations
   - Complete backup/restore

**Deliverable**: Working auxiliary services

---

### **Phase 6: Pinia Stores** 🏪
1. **CardStore**:
   - State, getters, actions
   - Integração com use cases
   - Loading states

2. **ParticipantStore**:
   - Complete CRUD
   - Validations

3. **InvoiceStore**:
   - Active invoice management
   - Invoice history
   - Derived calculations

4. **AppStore**:
   - Global settings
   - Notifications
   - Global loading

**Deliverable**: Managed global state

---

### **Phase 7: Base Components** 🧩
1. **Layout**:
   - AppLayout (com navigation drawer)
   - AppHeader
   - AppNavigation

2. **Common Components**:
   - ConfirmDialog
   - FormDialog
   - DataTable (Vuetify wrapper with custom features)
   - CurrencyInput
   - PhoneInput
   - EmptyState
   - LoadingOverlay

**Deliverable**: Reusable UI base

---

### **Phase 8: Cards CRUD** 💳
1. **Views**:
   - CardsView (listing)
   
2. **Components**:
   - CardList (table)
   - CardFormDialog (create/edit modal)
   - CardDeleteDialog

3. **Validations**:
   - Required nickname
   - Last 4 digits (numeric)
   - Duplication

**Deliverable**: Complete cards CRUD

---

### **Phase 9: Participants CRUD** 👥
1. **Views**:
   - ParticipantsView

2. **Components**:
   - ParticipantList
   - ParticipantFormDialog
   - ParticipantDeleteDialog

3. **Validations**:
   - Required name
   - Valid phone (BR format)
   - Duplication

**Deliverable**: Complete participants CRUD

---

### **Phase 10: CSV Import** 📄
1. **Components**:
   - ImportInvoiceDialog
   - FileUpload
   - CSVPreview

2. **Flow**:
   - Upload file
   - Select card
   - Define due date
   - Data preview
   - Confirm import

3. **Validations**:
   - Valid CSV format
   - Required columns
   - Numeric values
   - Selected card

**Deliverable**: Working CSV import

---

### **Phase 11: Value Splitting Screen** 💰
1. **Views**:
   - InvoiceDetailView

2. **Components**:
   - InvoiceHeader (card info, totals, difference)
   - TransactionTable (table with dynamic participants)
   - ParticipantCell (input + selection icons)
   - ParticipantHeader (name + copy button)
   - InvoiceSummary

3. **Logic**:
   - Automatic division (check icon)
   - Manual input
   - Automatic recalculation
   - Total validation

4. **Features**:
   - Save draft
   - Auto-save (debounce)
   - Zero balance validation

**Deliverable**: Complete main work screen

---

### **Phase 12: WhatsApp Message Generation** 💬
1. **Formatter**:
   - Message template
   - Formatting per participant
   - Totalizers

2. **Components**:
   - MessagePreviewDialog
   - CopyButton (with feedback)

3. **Features**:
   - Copy to clipboard
   - Preview before copying
   - Future: WhatsApp Web integration

**Deliverable**: Message generation and copying

---

### **Phase 13: Dashboard/Home** 🏠
1. **Views**:
   - HomeView/DashboardView

2. **Components**:
   - RecentInvoicesCard
   - StatsCard (total cards, participants)
   - OpenInvoiceCard (continue where left off)
   - QuickActions

3. **Features**:
   - Continue open invoice
   - View history
   - Quick access

**Deliverable**: Functional home screen

---

### **Phase 14: Data Export/Import** 📦
1. **Components**:
   - ExportDataDialog
   - ImportDataDialog

2. **Features**:
   - Complete export (JSON)
   - Import with validation
   - Merge or replace
   - File download/upload

3. **Validations**:
   - Data integrity
   - Format version
   - Conflicts

**Deliverable**: Working backup and restore

---

### **Phase 15: PWA** 📱
1. **Configuration**:
   - Service Worker
   - Manifest.json
   - Icons (multiple sizes)

2. **Features**:
   - Installable
   - Offline support
   - Cache strategy
   - Update prompt

**Deliverable**: Installable and offline app

---

### **Phase 16: Polish & Deploy** ✨
1. **UX/UI**:
   - Complete responsiveness
   - Visual feedback (loading, success, error)
   - Smooth transitions
   - Dark mode (Vuetify theme)

2. **Performance**:
   - Route lazy loading
   - Code splitting
   - Bundle optimization

3. **Deploy**:
   - Optimized build
   - Vercel or GitHub Pages
   - CI/CD (optional)

**Deliverable**: App in production

---

## Patterns and Conventions

### Naming
- **Components**: PascalCase (CardList.vue)
- **Composables**: camelCase com 'use' prefix (useCardForm.ts)
- **Stores**: camelCase com 'Store' suffix (cardStore.ts)
- **Types/Interfaces**: PascalCase com 'I' prefix para interfaces (ICard)
- **Constants**: UPPER_SNAKE_CASE

### TypeScript
- Strict mode enabled
- Avoid 'any', use 'unknown' when necessary
- Explicit return types in functions
- Interfaces for contracts, Types for composition

### Commits
- Conventional Commits
- Format: `type(scope): message`
- Types: feat, fix, refactor, docs, test, chore

### Tests (Future)
- Vitest for unit tests
- Testing Library for components
- Minimum coverage: 80%

---

## SOLID Principles Applied

1. **Single Responsibility**: Each class/component has a single responsibility
2. **Open/Closed**: Extensible via interfaces, closed for modification
3. **Liskov Substitution**: Repositories are interchangeable
4. **Interface Segregation**: Specific and focused interfaces
5. **Dependency Inversion**: Use cases depend on abstractions, not implementations

---

## Extension Points for Future API

1. **Repository Pattern**: Switch LocalStorage to HTTP easily
2. **Use Cases**: Remain the same, just inject new repository
3. **Error Handling**: Structure prepared for network errors
4. **Authentication**: Store structure prepared for token/user
5. **Sync**: LocalStorage can become cache + background sync

---

## Final Tech Stack

- ⚡ **Vite** - Build tool
- 🎨 **Vue 3** - Framework (Composition API + script setup)
- 📘 **TypeScript** - Type safety
- 🎭 **Vuetify 3** - UI Framework
- 🗺️ **Vue Router** - Routing
- 🍍 **Pinia** - State management
- 🎯 **MDI** - Icons
- 📱 **PWA** - Progressive Web App
- 💾 **LocalStorage** - Persistence (phase 1)

---

## Next Steps

1. ✅ Approve roadmap
2. 🚀 Initialize project
3. 🏗️ Implement layer by layer
4. 🎨 Build UI
5. 🚀 Deploy

**Total Estimate**: 2-3 weeks (complete development)
**Priority**: Functionality > Perfection (iterative MVP)
