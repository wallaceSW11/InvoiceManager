export default {
  app: {
    name: 'InvoiceManager',
    title: 'Gestor de Faturas'
  },
  nav: {
    home: 'Dashboard',
    cards: 'Cartões',
    participants: 'Participantes',
    invoices: 'Faturas'
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
    validation: {
      nicknameRequired: 'Apelido é obrigatório',
      nicknameTooLong: 'Apelido deve ter no máximo 15 caracteres',
      lastDigitsRequired: 'Últimos 4 dígitos são obrigatórios',
      lastDigitsInvalid: 'Deve ter exatamente 4 dígitos'
    },
    messages: {
      created: 'Cartão criado com sucesso',
      updated: 'Cartão atualizado com sucesso',
      deleted: 'Cartão excluído com sucesso',
      error: 'Erro ao gerenciar cartão'
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
    validation: {
      nameRequired: 'Nome é obrigatório',
      nameTooLong: 'Nome deve ter no máximo 20 caracteres',
      phoneRequired: 'Telefone é obrigatório',
      phoneInvalid: 'Telefone inválido'
    },
    messages: {
      created: 'Participante criado com sucesso',
      updated: 'Participante atualizado com sucesso',
      deleted: 'Participante excluído com sucesso',
      error: 'Erro ao gerenciar participante'
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
      import: 'Importar',
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
      difference: 'Diferença',
      search: 'Pesquisar compras',
      totals: 'Totais',
      noParticipantsSelected: 'Selecione os participantes para começar a dividir os valores'
    },
    whatsapp: {
      title: 'Mensagens WhatsApp',
      generate: 'Gerar Mensagens',
      copy: 'Copiar',
      copied: 'Copiado!',
      send: 'Enviar no WhatsApp'
    },
    statuses: {
      pending: 'Pendente',
      completed: 'Finalizada'
    }
  },
  theme: {
    toggle: 'Alternar tema',
    light: 'Modo claro',
    dark: 'Modo escuro'
  }
}
