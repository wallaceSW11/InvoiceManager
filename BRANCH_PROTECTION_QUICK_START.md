# 🔒 Proteção de Branch / Branch Protection - Guia Rápido

## 🇧🇷 Português

### Configuração Rápida

Para proteger a branch `main` e aceitar apenas Pull Requests:

#### 1. No GitHub Web
1. Vá para: `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Marque:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Include administrators
4. Clique em `Create`

#### 2. Fluxo de Trabalho

```bash
# 1. Crie uma branch
git checkout -b feature/minha-feature

# 2. Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade"

# 3. Envie para GitHub
git push origin feature/minha-feature

# 4. Crie Pull Request no GitHub
# 5. Aguarde aprovação e merge
```

### ⚠️ Importante

- ❌ **NÃO** faça commit direto na `main`
- ✅ **SEMPRE** crie uma branch
- ✅ **SEMPRE** use Pull Requests
- ✅ **AGUARDE** aprovação antes do merge

### 📖 Documentação Completa

Veja o arquivo `BRANCH_PROTECTION_GUIDE.md` para instruções detalhadas.

---

## 🇺🇸 English

### Quick Setup

To protect the `main` branch and accept only Pull Requests:

#### 1. On GitHub Web
1. Go to: `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Check:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Include administrators
4. Click `Create`

#### 2. Workflow

```bash
# 1. Create a branch
git checkout -b feature/my-feature

# 2. Make your changes
git add .
git commit -m "feat: new functionality"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# 5. Wait for approval and merge
```

### ⚠️ Important

- ❌ **DO NOT** commit directly to `main`
- ✅ **ALWAYS** create a branch
- ✅ **ALWAYS** use Pull Requests
- ✅ **WAIT** for approval before merge

### 📖 Complete Documentation

See `BRANCH_PROTECTION_GUIDE.md` for detailed instructions.

---

## 🤖 Automated Checks

This repository includes a GitHub Actions workflow (`.github/workflows/branch-protection.yml`) that:

- ❌ Blocks direct pushes to main
- ✅ Validates PR structure
- ✅ Checks for merge conflicts
- ℹ️ Recommends conventional commits

The workflow runs automatically on every PR to main.

---

**Quick Links:**
- 📚 [Full Guide](BRANCH_PROTECTION_GUIDE.md)
- 🔧 [GitHub Actions Workflow](.github/workflows/branch-protection.yml)
