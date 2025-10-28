# 💳 Invoice Manager

> A Progressive Web App for managing and splitting credit card invoices among family members or groups.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.5-green.svg)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.10-1976D2.svg)](https://vuetifyjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success.svg)](https://web.dev/progressive-web-apps/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [PWA Features](#-pwa-features)
- [Internationalization](#-internationalization)

---

## 🎯 Overview

**Invoice Manager** is a client-side Progressive Web App designed to help manage credit card invoices and split expenses among multiple participants. Import transactions from CSV files, assign participants to each transaction, and automatically calculate how much each person owes via WhatsApp.

### Key Capabilities

- 📥 **Import invoices** from CSV/TXT files
- 👥 **Manage participants** (family members, roommates, etc.)
- 💰 **Split transactions** equally or by custom amounts
- 💳 **Manage multiple cards** with nicknames
- 📱 **Share via WhatsApp** with automatic message generation
- 📴 **Works offline** after first visit (PWA)
- 🌍 **Multilingual** (English & Portuguese)

---

## ✨ Features

### 📂 Invoice Management
- Import invoices from CSV/TXT files with semicolon-separated values
- Format: `Date;Description;Amount` (e.g., `11/09/2025;Shopping Center;121,89`)
- Automatic transaction parsing and validation
- Track invoice status (Open/Completed)

### 💳 Card Management
- Add multiple credit cards with nicknames
- Store last 4 digits for identification
- Associate invoices with specific cards

### 👤 Participant Management
- Add participants with name and phone number
- Phone number masking: `(xx) xxxxx-xxxx`
- Integration with WhatsApp for payment requests

### 💸 Transaction Splitting
- **Equal Split**: Divide amount equally among selected participants
- **Custom Split**: Set specific amounts per participant
- Real-time validation and total calculation
- Visual indicators for validation status

### 📱 WhatsApp Integration
- Generate payment request messages automatically
- One-click sharing per participant
- Includes invoice details and payment amount

### 🌐 Internationalization (i18n)
- English (en-US)
- Portuguese (pt-BR)
- Language switcher in app bar

### 📴 Progressive Web App
- Install on mobile/desktop as native app
- Works offline after first visit
- Automatic updates when online
- Responsive design for all screen sizes

---

## 🛠️ Tech Stack

### Core
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework (Composition API)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling

### UI & Styling
- **[Vuetify 3](https://vuetifyjs.com/)** - Material Design component framework
- **[Material Design Icons](https://materialdesignicons.com/)** - Icon library

### State & Routing
- **[Pinia](https://pinia.vuejs.org/)** - Vue Store (state management)
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js

### Utilities
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internationalization plugin
- **[Big.js](https://github.com/MikeMcl/big.js/)** - Arbitrary-precision decimal arithmetic
- **[v-money3](https://github.com/jonathanpmartins/v-money3)** - Money input component

### PWA
- **[Vite Plugin PWA](https://vite-pwa-org.netlify.app/)** - PWA capabilities
- **[Workbox](https://developers.google.com/web/tools/workbox)** - Service Worker library

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── icon-192x192.png        # PWA icon (small)
│   └── icon-512x512.png        # PWA icon (large)
│
├── src/
│   ├── core/                   # Domain Layer (Business Logic)
│   │   ├── domain/
│   │   │   ├── entities/       # Card, Invoice, Participant, Transaction
│   │   │   ├── enums/          # InvoiceStatus, SplitMode
│   │   │   └── value-objects/  # Money, PhoneNumber, CardLastDigits
│   │   ├── repositories/
│   │   │   └── interfaces/     # Repository contracts
│   │   └── usecases/           # Business logic operations
│   │       ├── card/
│   │       ├── invoice/
│   │       └── participant/
│   │
│   ├── infrastructure/         # Data Layer
│   │   ├── formatters/         # Data formatting utilities
│   │   ├── parsers/            # CSV parsing logic
│   │   ├── repositories/
│   │   │   └── localstorage/   # LocalStorage implementations
│   │   └── utils/
│   │
│   ├── presentation/           # UI Layer
│   │   ├── components/         # Reusable Vue components
│   │   │   ├── card/
│   │   │   ├── invoice/
│   │   │   ├── participant/
│   │   │   ├── common/
│   │   │   ├── ImportInvoiceDialog.vue
│   │   │   └── ModalBase.vue
│   │   ├── composables/        # Vue composables
│   │   │   ├── useLocale.ts
│   │   │   └── usePhoneMask.ts
│   │   ├── i18n/               # Internationalization
│   │   │   └── locales/
│   │   │       ├── en-US.ts
│   │   │       └── pt-BR.ts
│   │   ├── plugins/            # Vue plugins
│   │   │   └── vuetify.ts
│   │   ├── router/             # Vue Router configuration
│   │   ├── stores/             # Pinia stores
│   │   │   ├── cardStore.ts
│   │   │   ├── invoiceStore.ts
│   │   │   └── participantStore.ts
│   │   └── views/              # Page components
│   │       ├── HomeView.vue
│   │       ├── CardsView.vue
│   │       ├── ParticipantsView.vue
│   │       ├── InvoicesView.vue
│   │       └── InvoiceDetailView.vue
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── types/
│   │   ├── utils/              # MoneyCalculator, etc.
│   │   └── validators/
│   │
│   ├── App.vue                 # Root component
│   ├── main.ts                 # Application entry point
│   └── vite-env.d.ts           # Vite type definitions
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration (PWA setup)
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.19+ or v22.12+ (recommended)
- **npm**: v10+ or **yarn**: v1.22+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wallaceSW11/InvoiceManager.git
   cd InvoiceManager/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## 📖 Usage

### 1. Initial Setup

#### Add Your Credit Cards
1. Navigate to **Cards** from the menu
2. Click **"Add Card"**
3. Enter:
   - **Nickname**: e.g., "Nubank", "Inter", "XP"
   - **Last 4 Digits**: e.g., "1234"
4. Save

#### Add Participants
1. Navigate to **Participants**
2. Click **"Add Participant"**
3. Enter:
   - **Name**: e.g., "John Doe"
   - **Phone**: Automatically formatted as `(xx) xxxxx-xxxx`
4. Save (repeat for all family members)

### 2. Import Invoice

#### Prepare CSV File
Format: `Date;Description;Amount`

Example (`invoice.txt`):
```
11/09/2025;Teresopolis Shopping Center;121,89
15/09/2025;Netflix Subscription;45,90
20/09/2025;Uber Ride;32,50
```

#### Import Steps
1. Click **"Import Invoice"** on Home
2. Select:
   - **Card** (from dropdown)
   - **Due Date**
   - **CSV File** (.txt)
3. Review transactions in preview
4. Click **"Import"**

### 3. Split Transactions

#### Equal Split
1. Select participants who share the expense
2. Click **"Equal Split"**
3. Amount is divided automatically

#### Custom Split
1. Select participants
2. Click **"Custom Split"**
3. Enter specific amount for each participant
4. System validates total matches transaction amount

### 4. Share via WhatsApp
1. After splitting, click WhatsApp icon next to participant
2. Message is auto-generated with:
   - Participant name
   - Amount owed
   - Invoice details
3. Send directly through WhatsApp Web/App

---

## 🏗️ Architecture

### Clean Architecture Principles

The project follows **Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│      Presentation Layer (UI)            │  ← Vue Components, Stores, Router
├─────────────────────────────────────────┤
│      Use Cases (Business Logic)         │  ← Invoice splitting, calculations
├─────────────────────────────────────────┤
│      Domain Layer (Entities)            │  ← Card, Invoice, Transaction, etc.
├─────────────────────────────────────────┤
│      Infrastructure (Data Access)       │  ← LocalStorage repositories, parsers
└─────────────────────────────────────────┘
```

### Key Design Patterns

- **Repository Pattern**: Abstract data access
- **Value Objects**: Money, PhoneNumber (immutable)
- **DTOs**: Data Transfer Objects for API-like operations
- **Composition API**: Modern Vue 3 pattern
- **Pinia Stores**: Centralized state management

### Data Flow

```
User Action → Component → Store → Use Case → Repository → LocalStorage
                  ↑                                              ↓
                  └──────────── Data Updates ────────────────────┘
```

---

## 📴 PWA Features

### Installation
- **Mobile**: Tap browser menu → "Add to Home Screen"
- **Desktop (Chrome/Edge)**: Click install icon in address bar

### Offline Capabilities
✅ Full UI available offline  
✅ All data persisted in LocalStorage  
✅ Create/edit/delete operations work offline  
✅ Automatic sync when back online  

### Manifest Configuration
Located in `vite.config.ts`:
- App name: "Invoice Manager"
- Theme color: `#1976D2` (Material Blue)
- Display mode: `standalone`
- Icons: 192px & 512px

### Service Worker
- Auto-generated by Vite Plugin PWA
- Precaches all assets (JS, CSS, fonts)
- Runtime caching for Google Fonts
- Auto-updates on new deployments

---

## 🌍 Internationalization

### Supported Languages
- 🇺🇸 **English** (`en-US`)
- 🇧🇷 **Portuguese** (`pt-BR`)

### Change Language
Click language switcher in app bar (top-right)

### Add New Language
1. Create `src/presentation/i18n/locales/[locale].ts`
2. Copy structure from `en-US.ts`
3. Translate all keys
4. Import in `src/presentation/i18n/index.ts`

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Wallace**  
GitHub: [@wallaceSW11](https://github.com/wallaceSW11)

---

## 🙏 Acknowledgments

- [Vuetify Team](https://vuetifyjs.com/) for the amazing component library
- [Vue.js Core Team](https://vuejs.org/) for the fantastic framework
- Material Design for the design system

---

**Made with ❤️ using Vue 3 + TypeScript + Vuetify**
