# 🔒 Guia de Proteção da Branch Main / Main Branch Protection Guide

## 🇧🇷 Português

### Como Proteger a Branch Main para Aceitar Apenas Pull Requests

Este guia mostra como configurar a proteção da branch `main` no GitHub para impedir commits diretos e aceitar apenas mudanças através de Pull Requests.

#### Por Que Proteger a Branch Main?

- ✅ **Qualidade do Código**: Todos os commits passam por revisão
- ✅ **Segurança**: Previne alterações acidentais ou não autorizadas
- ✅ **Rastreabilidade**: Histórico claro de mudanças através de PRs
- ✅ **Testes Automatizados**: Garante que CI/CD seja executado antes do merge
- ✅ **Colaboração**: Facilita revisões de código em equipe

#### Passo a Passo para Configurar a Proteção

##### 1. Acessar Configurações do Repositório

1. Abra seu repositório no GitHub: `https://github.com/wallaceSW11/InvoiceManager`
2. Clique na aba **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Branches** (ou **Ramos**)

##### 2. Adicionar Regra de Proteção

1. Na seção "Branch protection rules", clique em **Add rule** (ou **Add branch protection rule**)
2. No campo "Branch name pattern", digite: `main`

##### 3. Configurar as Regras Recomendadas

Marque as seguintes opções:

**Opções Essenciais:**

- ✅ **Require a pull request before merging**
  - Exige que todas as alterações sejam feitas via Pull Request
  - Sub-opções recomendadas:
    - ✅ **Require approvals** (pelo menos 1 aprovação)
    - ✅ **Dismiss stale pull request approvals when new commits are pushed**
    - ⚠️ **Require review from Code Owners** (opcional, se você tiver arquivo CODEOWNERS)

- ✅ **Require status checks to pass before merging**
  - Garante que testes e CI/CD passem antes do merge
  - Após configurar GitHub Actions, você pode selecionar quais checks são obrigatórios
  - Sub-opção recomendada:
    - ✅ **Require branches to be up to date before merging**

- ✅ **Require conversation resolution before merging**
  - Todos os comentários do PR devem ser resolvidos antes do merge

- ✅ **Include administrators**
  - Aplica as regras mesmo para administradores do repositório
  - ⚠️ Use com cuidado: você não poderá fazer commits diretos nem como admin

**Opções Adicionais (Recomendadas):**

- ✅ **Require linear history**
  - Evita merge commits, mantém histórico limpo
  - Força uso de squash ou rebase

- ✅ **Do not allow bypassing the above settings**
  - Ninguém pode pular as proteções

- ⚠️ **Allow force pushes** → **Deixe DESMARCADO**
  - Previne force pushes que podem reescrever histórico

- ⚠️ **Allow deletions** → **Deixe DESMARCADO**
  - Previne exclusão acidental da branch

##### 4. Salvar as Configurações

1. Role até o final da página
2. Clique em **Create** (ou **Save changes**)

#### Configuração Mínima Recomendada

Se você quer apenas bloquear commits diretos e exigir PRs:

```
✅ Require a pull request before merging
   ✅ Require approvals: 1
✅ Include administrators
```

#### Como Trabalhar com Branch Protegida

Agora que a branch `main` está protegida, siga este fluxo de trabalho:

##### 1. Criar uma Nova Branch

```bash
# Certifique-se de estar na main e atualizado
git checkout main
git pull origin main

# Crie uma nova branch para sua feature
git checkout -b feature/minha-feature
```

##### 2. Fazer Mudanças e Commit

```bash
# Faça suas alterações
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Envie para o GitHub
git push origin feature/minha-feature
```

##### 3. Criar um Pull Request

1. Vá até o repositório no GitHub
2. Clique em **Pull requests**
3. Clique em **New pull request**
4. Selecione sua branch (`feature/minha-feature`) para fazer merge na `main`
5. Preencha título e descrição
6. Clique em **Create pull request**

##### 4. Revisar e Fazer Merge

1. Aguarde revisão (se configurou aprovações obrigatórias)
2. Aguarde CI/CD passar (se configurou status checks)
3. Clique em **Merge pull request**
4. Confirme o merge
5. Exclua a branch após o merge (opcional)

#### Verificação Rápida

Para verificar se a proteção está ativa:

```bash
# Tente fazer commit direto na main (deve falhar)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin main
```

Você deve ver uma mensagem de erro parecida com:
```
remote: error: GH006: Protected branch update failed
remote: error: At least 1 approving review is required
```

#### Troubleshooting

**Problema: Não consigo ver a opção "Branches" nas configurações**
- Solução: Você precisa ter permissões de Admin no repositório

**Problema: Quero fazer um commit urgente na main**
- Solução Temporária: Desmarque "Include administrators" e faça o commit
- ⚠️ Lembre-se de reativar a proteção depois!

**Problema: Esqueci de criar uma branch e fiz commit na main local**
- Solução:
  ```bash
  # Crie a branch a partir do commit atual
  git checkout -b feature/minha-feature
  
  # Volte a main para o estado anterior
  git checkout main
  git reset --hard origin/main
  
  # Agora push da sua feature branch
  git checkout feature/minha-feature
  git push origin feature/minha-feature
  ```

---

## 🇺🇸 English

### How to Protect the Main Branch to Accept Only Pull Requests

This guide shows how to configure main branch protection on GitHub to prevent direct commits and accept changes only through Pull Requests.

#### Why Protect the Main Branch?

- ✅ **Code Quality**: All commits go through review
- ✅ **Security**: Prevents accidental or unauthorized changes
- ✅ **Traceability**: Clear history of changes through PRs
- ✅ **Automated Testing**: Ensures CI/CD runs before merging
- ✅ **Collaboration**: Facilitates team code reviews

#### Step-by-Step Configuration Guide

##### 1. Access Repository Settings

1. Open your repository on GitHub: `https://github.com/wallaceSW11/InvoiceManager`
2. Click on the **Settings** tab
3. In the left sidebar, click on **Branches**

##### 2. Add Protection Rule

1. In the "Branch protection rules" section, click **Add rule** (or **Add branch protection rule**)
2. In the "Branch name pattern" field, type: `main`

##### 3. Configure Recommended Rules

Check the following options:

**Essential Options:**

- ✅ **Require a pull request before merging**
  - Requires all changes to be made via Pull Request
  - Recommended sub-options:
    - ✅ **Require approvals** (at least 1 approval)
    - ✅ **Dismiss stale pull request approvals when new commits are pushed**
    - ⚠️ **Require review from Code Owners** (optional, if you have CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - Ensures tests and CI/CD pass before merge
  - After setting up GitHub Actions, you can select which checks are required
  - Recommended sub-option:
    - ✅ **Require branches to be up to date before merging**

- ✅ **Require conversation resolution before merging**
  - All PR comments must be resolved before merge

- ✅ **Include administrators**
  - Applies rules even to repository administrators
  - ⚠️ Use carefully: you won't be able to make direct commits even as admin

**Additional Options (Recommended):**

- ✅ **Require linear history**
  - Avoids merge commits, keeps history clean
  - Forces use of squash or rebase

- ✅ **Do not allow bypassing the above settings**
  - No one can skip the protections

- ⚠️ **Allow force pushes** → **Leave UNCHECKED**
  - Prevents force pushes that can rewrite history

- ⚠️ **Allow deletions** → **Leave UNCHECKED**
  - Prevents accidental branch deletion

##### 4. Save Settings

1. Scroll to the bottom of the page
2. Click **Create** (or **Save changes**)

#### Minimum Recommended Configuration

If you just want to block direct commits and require PRs:

```
✅ Require a pull request before merging
   ✅ Require approvals: 1
✅ Include administrators
```

#### How to Work with Protected Branch

Now that the `main` branch is protected, follow this workflow:

##### 1. Create a New Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a new branch for your feature
git checkout -b feature/my-feature
```

##### 2. Make Changes and Commit

```bash
# Make your changes
git add .
git commit -m "feat: add new functionality"

# Push to GitHub
git push origin feature/my-feature
```

##### 3. Create a Pull Request

1. Go to the repository on GitHub
2. Click on **Pull requests**
3. Click on **New pull request**
4. Select your branch (`feature/my-feature`) to merge into `main`
5. Fill in title and description
6. Click **Create pull request**

##### 4. Review and Merge

1. Wait for review (if you configured required approvals)
2. Wait for CI/CD to pass (if you configured status checks)
3. Click **Merge pull request**
4. Confirm the merge
5. Delete the branch after merge (optional)

#### Quick Verification

To verify that protection is active:

```bash
# Try to commit directly to main (should fail)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin main
```

You should see an error message similar to:
```
remote: error: GH006: Protected branch update failed
remote: error: At least 1 approving review is required
```

#### Troubleshooting

**Problem: Can't see "Branches" option in settings**
- Solution: You need Admin permissions on the repository

**Problem: I need to make an urgent commit to main**
- Temporary Solution: Uncheck "Include administrators" and make the commit
- ⚠️ Remember to re-enable protection afterwards!

**Problem: Forgot to create a branch and committed to main locally**
- Solution:
  ```bash
  # Create branch from current commit
  git checkout -b feature/my-feature
  
  # Return main to previous state
  git checkout main
  git reset --hard origin/main
  
  # Now push your feature branch
  git checkout feature/my-feature
  git push origin feature/my-feature
  ```

---

## 📚 Additional Resources

- [GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [Git Branching Strategy](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

**Created**: October 27, 2025
**Repository**: wallaceSW11/InvoiceManager
