export default {
  app: {
    name: 'InvoiceManager',
    title: 'Invoice Manager'
  },
  nav: {
    home: 'Home',
    cards: 'Cards',
    participants: 'Participants',
    invoices: 'Invoices'
  },
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    actions: 'Actions',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    yes: 'Yes',
    no: 'No'
  },
  cards: {
    title: 'Cards',
    add: 'Add Card',
    edit: 'Edit Card',
    new: 'New Card',
    delete: 'Delete Card',
    deleteConfirm: 'Delete card "{nickname}"?',
    nickname: 'Nickname',
    lastDigits: 'Last Digits',
    lastFourDigits: 'Last 4 Digits',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    validation: {
      nicknameRequired: 'Nickname is required',
      nicknameTooLong: 'Nickname must be at most 15 characters',
      lastDigitsRequired: 'Last 4 digits are required',
      lastDigitsInvalid: 'Must be exactly 4 digits'
    },
    messages: {
      created: 'Card created successfully',
      updated: 'Card updated successfully',
      deleted: 'Card deleted successfully',
      error: 'Error managing card'
    }
  },
  participants: {
    title: 'Participants',
    add: 'Add Participant',
    edit: 'Edit Participant',
    new: 'New Participant',
    delete: 'Delete Participant',
    deleteConfirm: 'Delete participant "{name}"?',
    name: 'Name',
    phoneNumber: 'Phone Number',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    validation: {
      nameRequired: 'Name is required',
      nameTooLong: 'Name must be at most 20 characters',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Invalid phone number'
    },
    messages: {
      created: 'Participant created successfully',
      updated: 'Participant updated successfully',
      deleted: 'Participant deleted successfully',
      error: 'Error managing participant'
    }
  },
  home: {
    title: 'Dashboard',
    stats: {
      cards: 'Cards',
      participants: 'Participants',
      invoices: 'Invoices'
    },
    invoices: {
      title: 'Invoices',
      noInvoices: 'No invoices found'
    },
    openInvoice: {
      title: 'Open Invoice',
      card: 'Card',
      dueDate: 'Due Date',
      total: 'Total',
      continue: 'Continue'
    },
    quickActions: {
      title: 'Quick Actions',
      manageCards: 'Manage Cards',
      manageParticipants: 'Manage Participants'
    }
  },
  invoice: {
    title: 'Invoice',
    detail: 'Invoice Detail',
    new: 'New Invoice',
    import: {
      title: 'Import Invoice',
      step1: 'Select File',
      step2: 'Preview',
      selectCard: 'Select Card',
      dueDate: 'Due Date',
      selectFile: 'Select TXT file',
      parseErrors: 'Errors parsing file:',
      noTransactions: 'No transactions found in file',
      import: 'Import',
      validation: {
        cardRequired: 'Card is required',
        dueDateRequired: 'Due date is required',
        fileRequired: 'File is required'
      },
      preview: {
        info: '{count} transactions found',
        date: 'Date',
        description: 'Description',
        amount: 'Amount',
        total: 'Total',
        button: 'Preview'
      }
    },
    card: 'Card',
    dueDate: 'Due Date',
    total: 'Total',
    status: 'Status',
    transactions: 'Transactions',
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    split: {
      title: 'Split',
      selectParticipants: 'Select Participants',
      autoSplitAll: 'Split All Equally',
      divideAll: 'Divide to all',
      difference: 'Difference',
      search: 'Search purchases',
      totals: 'Totals',
      noParticipantsSelected: 'Select participants to start splitting values'
    },
    whatsapp: {
      title: 'WhatsApp Messages',
      generate: 'Generate Messages',
      copy: 'Copy',
      copied: 'Copied!',
      send: 'Send on WhatsApp'
    },
    statuses: {
      draft: 'Draft',
      open: 'Open',
      closed: 'Closed'
    }
  },
  theme: {
    toggle: 'Toggle theme',
    light: 'Light mode',
    dark: 'Dark mode'
  }
}
