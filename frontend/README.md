# 💳 Invoice Manager

A modern web application for splitting credit card bills among family members and friends. Easily manage shared expenses, calculate individual shares, and send payment requests directly via WhatsApp.

## 📝 Overview

Invoice Manager helps you manage shared credit card expenses by:
- Importing credit card invoices (CSV format)
- Assigning transactions to specific participants
- Automatically calculating each person's share
- Sending payment requests via WhatsApp with a single click
- Managing multiple cards and participants
- Tracking invoice status (pending, paid, etc.)

Perfect for families sharing expenses, roommates splitting bills, or groups managing shared costs.

## ✨ Features

- **Invoice Import**: Import credit card statements from CSV files
- **Participant Management**: Add and manage family members or friends
- **Card Management**: Track multiple credit cards
- **Transaction Split**: Assign transactions to one or multiple participants
- **Split Modes**: 
  - Equal split among participants
  - Custom amounts per participant
  - Single participant assignment
- **WhatsApp Integration**: Send payment requests directly via WhatsApp
- **Multi-language Support**: Available in English and Portuguese (pt-BR)
- **Dark/Light Theme**: Customizable interface theme
- **Offline Support**: PWA (Progressive Web App) with offline capabilities
- **Local Storage**: All data stored locally in your browser

## 🛠️ Technology Stack

This application is built with modern web technologies:

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **UI Framework**: [Vuetify 3](https://vuetifyjs.com/) (Material Design)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Internationalization**: [Vue I18n](https://vue-i18n.intlify.dev/)
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Money Calculations**: [big.js](https://github.com/MikeMcl/big.js/) for precise decimal arithmetic

### Architecture

The project follows **Clean Architecture** principles with:

- **Domain Layer**: Entities, Value Objects, and Enums
- **Use Cases Layer**: Business logic and application rules
- **Infrastructure Layer**: Data persistence (LocalStorage) and external services
- **Presentation Layer**: Vue components, views, and UI logic

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/wallaceSW11/InvoiceManager.git

# Navigate to the frontend directory
cd InvoiceManager/frontend

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 📱 Usage

1. **Add Participants**: Start by adding family members or friends who share expenses
2. **Add Cards**: Register the credit cards you want to manage
3. **Import Invoice**: Upload a CSV file with your credit card statement
4. **Assign Transactions**: Go through each transaction and assign it to participants
5. **Review & Send**: Review the calculated amounts and send payment requests via WhatsApp

## 🎨 Developed with AI

This project was **100% developed using AI-assisted coding** (Claude/GitHub Copilot), demonstrating the power of modern AI tools in creating full-featured applications with:
- Clean architecture patterns
- TypeScript type safety
- Responsive design
- Internationalization
- Progressive Web App capabilities

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Developed by Wallace SW
- GitHub: [@wallaceSW11](https://github.com/wallaceSW11)

---

Made with ❤️ using AI-assisted development
