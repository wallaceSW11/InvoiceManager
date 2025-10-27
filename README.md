# 📊 InvoiceManager

Sistema de gerenciamento de faturas para divisão de gastos entre participantes.

## 🚀 Começando

Veja o [Guia de Início](frontend/GETTING_STARTED.md) para instruções detalhadas sobre o projeto.

## 📁 Estrutura do Projeto

```
InvoiceManager/
├── frontend/           # Aplicação Vue.js
│   ├── src/           # Código fonte
│   ├── public/        # Assets estáticos
│   └── ...
└── docs/              # Documentação
```

## 🔒 Proteção de Branch

Este repositório está configurado para aceitar apenas Pull Requests na branch `main`.

### Documentação de Proteção de Branch

- 📖 [**Guia Completo**](BRANCH_PROTECTION_GUIDE.md) - Instruções detalhadas em PT-BR e EN
- ⚡ [**Guia Rápido**](BRANCH_PROTECTION_QUICK_START.md) - Referência rápida
- ✅ [**Checklist de Configuração**](BRANCH_PROTECTION_CHECKLIST.md) - Lista de verificação passo a passo

### Fluxo de Trabalho Recomendado

```bash
# 1. Criar nova branch
git checkout -b feature/minha-feature

# 2. Fazer alterações e commit
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push para GitHub
git push origin feature/minha-feature

# 4. Criar Pull Request no GitHub
# 5. Aguardar aprovação e merge
```

### ⚠️ Regras Importantes

- ❌ Commits diretos na `main` não são permitidos
- ✅ Todas as mudanças devem ser feitas via Pull Request
- ✅ Pull Requests requerem pelo menos 1 aprovação
- ✅ Todos os checks de CI/CD devem passar

## 🤖 GitHub Actions

Este repositório inclui workflows automatizados:

- **Branch Protection Check** - Valida PRs e bloqueia commits diretos na main
  - Verifica título e descrição do PR
  - Detecta conflitos de merge
  - Valida nome da branch
  - Recomenda conventional commits

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
cd frontend
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

## 📚 Documentação Adicional

- [Guia de Uso](frontend/USAGE_GUIDE.md)
- [Implementação de I18N](frontend/I18N_IMPLEMENTATION.md)
- [Importação de CSV](frontend/CSV_IMPORT_AND_SPLITTING_IMPLEMENTATION.md)
- [Resumo de Implementação](frontend/IMPLEMENTATION_SUMMARY.md)
- [Roadmap](frontend/ROADMAP.md)

## 🤝 Contribuindo

1. Leia o [Guia de Proteção de Branch](BRANCH_PROTECTION_GUIDE.md)
2. Crie uma branch para sua feature
3. Faça commits seguindo [Conventional Commits](https://www.conventionalcommits.org/)
4. Abra um Pull Request
5. Aguarde revisão e aprovação

## 📝 Licença

Este projeto é de código aberto.

---

**Última Atualização**: Outubro 2025
