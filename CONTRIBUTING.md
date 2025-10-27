# 🤝 Guia de Contribuição / Contributing Guide

## 🇧🇷 Português

Obrigado por seu interesse em contribuir com o InvoiceManager! Este documento fornece diretrizes para contribuir com o projeto.

### 🚀 Começando

1. **Fork o repositório**
2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU_USUARIO/InvoiceManager.git
   cd InvoiceManager
   ```
3. **Configure o upstream**
   ```bash
   git remote add upstream https://github.com/wallaceSW11/InvoiceManager.git
   ```

### 🔒 Branch Protection

Este repositório usa proteção de branch. **IMPORTANTE**:

- ❌ **NÃO** faça commit direto na branch `main`
- ✅ **SEMPRE** crie uma branch para suas mudanças
- ✅ **SEMPRE** abra um Pull Request

📖 Leia o [Guia de Proteção de Branch](BRANCH_PROTECTION_GUIDE.md) para mais detalhes.

### 📝 Fluxo de Trabalho

#### 1. Sincronize com o repositório principal

```bash
git checkout main
git pull upstream main
```

#### 2. Crie uma branch para sua feature

Use nomes descritivos seguindo o padrão:

```bash
# Features
git checkout -b feature/nome-da-feature

# Bug fixes
git checkout -b fix/descricao-do-bug

# Documentação
git checkout -b docs/topico-da-doc

# Outros
git checkout -b refactor/descricao
git checkout -b test/descricao
git checkout -b chore/descricao
```

#### 3. Faça suas alterações

- Escreva código limpo e auto-documentado
- Siga os padrões do projeto
- Adicione testes quando aplicável

#### 4. Commit suas mudanças

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .

# Exemplos de commits:
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige cálculo de divisão"
git commit -m "docs: atualiza guia de instalação"
git commit -m "refactor: melhora estrutura de pastas"
git commit -m "test: adiciona testes para componente Card"
```

**Tipos de commit:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Apenas documentação
- `style:` Formatação, não afeta lógica
- `refactor:` Refatoração de código
- `perf:` Melhoria de performance
- `test:` Adiciona ou corrige testes
- `chore:` Manutenção, dependências, build
- `ci:` Mudanças em CI/CD
- `revert:` Reverte commit anterior

#### 5. Push para seu fork

```bash
git push origin feature/nome-da-feature
```

#### 6. Abra um Pull Request

1. Vá para o repositório no GitHub
2. Clique em "Pull requests" → "New pull request"
3. Selecione sua branch
4. Preencha o template do PR
5. Clique em "Create pull request"

### ✅ Checklist do Pull Request

Antes de abrir um PR, verifique:

- [ ] Código compila sem erros
- [ ] Todos os testes passam
- [ ] Código segue os padrões do projeto
- [ ] Commits seguem Conventional Commits
- [ ] Documentação foi atualizada (se necessário)
- [ ] PR tem título e descrição claros
- [ ] Branch está atualizada com a main

### 🧪 Testes

```bash
cd frontend
npm install
npm run dev    # Testar localmente
npm run build  # Verificar build
```

### 📋 Padrões de Código

- **TypeScript**: Use tipagem forte, evite `any`
- **Vue 3**: Use Composition API
- **Componentes**: Mantenha-os pequenos e reutilizáveis
- **Nomes**: Use nomes descritivos em português ou inglês
- **Comentários**: Apenas quando necessário, código deve ser auto-explicativo

### 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **comportamento atual**
4. **Screenshots** (se aplicável)
5. **Ambiente** (navegador, SO, versão)

### 💡 Sugerindo Features

Ao sugerir features:

1. **Descreva o problema** que a feature resolve
2. **Explique a solução** proposta
3. **Considere alternativas**
4. **Mostre exemplos** de uso

### 🔍 Processo de Revisão

Após abrir um PR:

1. **Automated checks** executarão automaticamente
2. **Revisores** podem solicitar mudanças
3. **Endereçe feedback** fazendo novos commits
4. **Aguarde aprovação** de pelo menos 1 revisor
5. **Merge** será feito após aprovação e checks passarem

### 📞 Dúvidas?

- Abra uma [Issue](https://github.com/wallaceSW11/InvoiceManager/issues)
- Consulte a [Documentação](README.md)

---

## 🇺🇸 English

Thank you for your interest in contributing to InvoiceManager! This document provides guidelines for contributing to the project.

### 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/InvoiceManager.git
   cd InvoiceManager
   ```
3. **Set up upstream**
   ```bash
   git remote add upstream https://github.com/wallaceSW11/InvoiceManager.git
   ```

### 🔒 Branch Protection

This repository uses branch protection. **IMPORTANT**:

- ❌ **DO NOT** commit directly to the `main` branch
- ✅ **ALWAYS** create a branch for your changes
- ✅ **ALWAYS** open a Pull Request

📖 Read the [Branch Protection Guide](BRANCH_PROTECTION_GUIDE.md) for details.

### 📝 Workflow

#### 1. Sync with main repository

```bash
git checkout main
git pull upstream main
```

#### 2. Create a feature branch

Use descriptive names following the pattern:

```bash
# Features
git checkout -b feature/feature-name

# Bug fixes
git checkout -b fix/bug-description

# Documentation
git checkout -b docs/doc-topic

# Others
git checkout -b refactor/description
git checkout -b test/description
git checkout -b chore/description
```

#### 3. Make your changes

- Write clean, self-documenting code
- Follow project standards
- Add tests when applicable

#### 4. Commit your changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .

# Commit examples:
git commit -m "feat: add email validation"
git commit -m "fix: correct split calculation"
git commit -m "docs: update installation guide"
```

#### 5. Push to your fork

```bash
git push origin feature/feature-name
```

#### 6. Open a Pull Request

1. Go to the repository on GitHub
2. Click "Pull requests" → "New pull request"
3. Select your branch
4. Fill in the PR template
5. Click "Create pull request"

### ✅ Pull Request Checklist

Before opening a PR, check:

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code follows project standards
- [ ] Commits follow Conventional Commits
- [ ] Documentation updated (if needed)
- [ ] PR has clear title and description
- [ ] Branch is up to date with main

---

**Last Updated**: October 2025
