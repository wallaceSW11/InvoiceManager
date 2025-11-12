export default {
  app: {
    name: 'InvoiceManager',
    title: 'Gestor de Faturas'
  },
  nav: {
    home: 'Dashboard',
    cards: 'Cartões',
    participants: 'Participantes',
    invoices: 'Faturas',
    export: 'Exportar',
    import: 'Importar'
  },
  common: {
    add: 'Adicionar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    close: 'Fechar',
    confirm: 'Confirmar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    actions: 'Ações',
    loading: 'Carregando...',
    noData: 'Nenhum dado disponível',
    error: 'Erro',
    success: 'Sucesso',
    continue: 'Continuar',
    back: 'Voltar',
    next: 'Próximo',
    finish: 'Finalizar',
    yes: 'Sim',
    no: 'Não',
    unknown: 'Desconhecido'
  },
  cards: {
    title: 'Cartões',
    add: 'Adicionar Cartão',
    edit: 'Editar Cartão',
    new: 'Novo Cartão',
    delete: 'Excluir Cartão',
    deleteConfirm: 'Excluir cartão "{nickname}"?',
    nickname: 'Apelido',
    lastDigits: 'Últimos Dígitos',
    lastFourDigits: 'Últimos 4 Dígitos',
    createdAt: 'Criado Em',
    updatedAt: 'Atualizado Em',
    noData: 'Nenhum cartão cadastrado',
    validation: {
      nicknameRequired: 'Apelido é obrigatório',
      nicknameTooLong: 'Apelido deve ter no máximo 15 caracteres',
      lastDigitsRequired: 'Últimos 4 dígitos são obrigatórios',
      lastDigitsInvalid: 'Deve ter exatamente 4 dígitos'
    },
    messages: {
      created: 'Cartão criado',
      updated: 'Cartão atualizado',
      deleted: 'Cartão excluído',
      error: 'Falha ao gerenciar cartão'
    }
  },
  participants: {
    title: 'Participantes',
    add: 'Adicionar Participante',
    edit: 'Editar Participante',
    new: 'Novo Participante',
    delete: 'Excluir Participante',
    deleteConfirm: 'Excluir participante "{name}"?',
    name: 'Nome',
    phoneNumber: 'Telefone',
    createdAt: 'Criado Em',
    updatedAt: 'Atualizado Em',
    noData: 'Nenhum participante cadastrado',
    validation: {
      nameRequired: 'Nome é obrigatório',
      nameTooLong: 'Nome deve ter no máximo 20 caracteres',
      phoneRequired: 'Telefone é obrigatório',
      phoneInvalid: 'Telefone inválido'
    },
    messages: {
      created: 'Participante criado',
      updated: 'Participante atualizado',
      deleted: 'Participante excluído',
      error: 'Falha ao gerenciar participante'
    }
  },
  home: {
    title: 'Dashboard',
    stats: {
      cards: 'Cartões',
      participants: 'Participantes',
      invoices: 'Faturas'
    },
    invoices: {
      title: 'Faturas',
      noInvoices: 'Nenhuma fatura encontrada'
    },
    openInvoice: {
      title: 'Fatura em Aberto',
      card: 'Cartão',
      dueDate: 'Vencimento',
      total: 'Total',
      continue: 'Continuar'
    },
    quickActions: {
      title: 'Ações Rápidas',
      manageCards: 'Gerenciar Cartões',
      manageParticipants: 'Gerenciar Participantes'
    }
  },
  invoice: {
    title: 'Fatura',
    detail: 'Detalhes da Fatura',
    new: 'Nova Fatura',
    list: {
      title: 'Faturas',
      subtitle: 'Todas as Faturas',
      noInvoices: 'Nenhuma fatura encontrada',
      noData: 'Nenhuma fatura importada',
      deleteConfirm: 'Excluir Fatura',
      deleteMessage: 'Deseja realmente excluir a fatura do cartão {card} com vencimento em {date}?'
    },
    actions: {
      complete: 'Finalizar',
      reopen: 'Reabrir'
    },
    import: {
      title: 'Importar Fatura',
      step1: 'Selecionar Arquivo',
      step2: 'Visualizar',
      selectCard: 'Selecione o Cartão',
      dueDate: 'Data de Vencimento',
      selectFile: 'Selecione o arquivo TXT',
      parseErrors: 'Erros ao processar arquivo:',
      noTransactions: 'Nenhuma transação encontrada no arquivo',
      alreadyExists: 'Esta fatura já foi importada',
      import: 'Importar',
      formatInfo: {
        title: 'Formato do arquivo:',
        description: 'O arquivo deve conter 3 colunas separadas por ponto e vírgula (;):'
      },
      validation: {
        cardRequired: 'Cartão é obrigatório',
        dueDateRequired: 'Data de vencimento é obrigatória',
        fileRequired: 'Arquivo é obrigatório'
      },
      preview: {
        info: '{count} transações encontradas',
        date: 'Data',
        description: 'Descrição',
        amount: 'Valor',
        total: 'Total',
        button: 'Visualizar'
      },
      messages: {
        success: 'Fatura importada',
        error: 'Falha ao importar fatura'
      }
    },
    card: 'Cartão',
    dueDate: 'Vencimento',
    total: 'Total',
    status: 'Status',
    transactions: 'Transações',
    date: 'Data',
    description: 'Descrição',
    amount: 'Valor',
    split: {
      title: 'Divisão',
      selectParticipants: 'Selecione os Participantes',
      autoSplitAll: 'Dividir Tudo Igualmente',
      select: 'Selecionar',
      divideAll: 'Dividir para todos',
      removeAll: 'Remover de todos',
      add: 'Adicionar',
      remove: 'Remover',
      manualValue: 'Valor manual',
      difference: 'Diferença',
      search: 'Pesquisar compras',
      totals: 'Totais',
      noParticipantsSelected: 'Selecione os participantes para começar a dividir os valores',
      editAmount: 'Editar valor do lançamento',
      saveAmount: 'Salvar valor',
      invalidAmount: 'Valor inválido',
      amountUpdated: 'Valor do lançamento atualizado. Os valores dos participantes foram limpos.',
      deleteTransaction: 'Excluir lançamento',
      confirmDelete: 'Tem certeza que deseja excluir este lançamento?',
      confirmDeleteMessage: 'Esta ação não pode ser desfeita.'
    },
    whatsapp: {
      title: 'Mensagens WhatsApp',
      generate: 'Gerar Mensagens',
      copy: 'Copiar',
      copied: 'Copiado!',
      copyAll: 'Copiar Resumo Completo',
      copiedAll: 'Resumo Copiado!',
      send: 'Enviar no WhatsApp'
    },
    statuses: {
      pending: 'Pendente',
      completed: 'Finalizada'
    },
    messages: {
      deleted: 'Fatura excluída',
      error: 'Falha ao gerenciar fatura'
    },
    saved: 'Fatura salva',
    savedMessage: 'A fatura foi salva',
    saveError: 'Falha ao salvar a fatura',
    transactionDeleted: 'Lançamento excluído',
    addTransaction: 'Adicionar Lançamento',
    transactionAdded: 'Lançamento adicionado'
  },
  export: {
    title: 'Exportar Dados',
    description: 'Selecione os dados que deseja exportar. Os arquivos serão baixados no formato JSON.',
    cards: 'Cartões',
    participants: 'Participantes',
    invoices: 'Faturas',
    exportButton: 'Exportar',
    noData: 'Não há dados disponíveis para exportar',
    success: '{count} arquivo(s) exportado(s)',
    error: 'Falha ao exportar dados'
  },
  import: {
    title: 'Importar Dados',
    description: 'Selecione os arquivos JSON para importar. Os dados do tipo selecionado serão substituídos.',
    warning: 'ATENÇÃO: Ao importar, todos os dados existentes do tipo selecionado (Cartões, Participantes ou Faturas) serão excluídos e substituídos pelos dados do arquivo.',
    cards: 'Cartões',
    participants: 'Participantes',
    invoices: 'Faturas',
    selectFile: 'Selecionar arquivo',
    importButton: 'Importar',
    cardSuccess: '1 cartão importado',
    cardsSuccess: '{count} cartões importados',
    participantSuccess: '1 participante importado',
    participantsSuccess: '{count} participantes importados',
    invoiceSuccess: '1 fatura importada',
    invoicesSuccess: '{count} faturas importadas',
    importedAt: 'Importado às {time}',
    error: 'Falha ao importar dados'
  },
  theme: {
    toggle: 'Alternar tema',
    light: 'Modo claro',
    dark: 'Modo escuro'
  }
}
