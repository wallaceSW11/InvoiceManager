# ✅ Checklist de Configuração da Proteção de Branch

## Para o Administrador do Repositório

Use este checklist para configurar corretamente a proteção da branch main.

---

### 📋 Pré-requisitos

- [ ] Você tem permissão de **Admin** no repositório
- [ ] Você está logado no GitHub
- [ ] Repositório: `wallaceSW11/InvoiceManager`

---

### 🔧 Passos de Configuração

#### Parte 1: Acessar Configurações

- [ ] 1. Abrir `https://github.com/wallaceSW11/InvoiceManager`
- [ ] 2. Clicar na aba **Settings**
- [ ] 3. No menu lateral, clicar em **Branches**

#### Parte 2: Criar Regra de Proteção

- [ ] 4. Clicar em **Add rule** (ou **Add branch protection rule**)
- [ ] 5. No campo "Branch name pattern", digitar: `main`

#### Parte 3: Configurar Proteções Essenciais

**Require a pull request before merging:**
- [ ] 6. ✅ Marcar "Require a pull request before merging"
- [ ] 7. ✅ Marcar "Require approvals"
- [ ] 8. Definir número de aprovações: `1` (ou mais)
- [ ] 9. ✅ Marcar "Dismiss stale pull request approvals when new commits are pushed"

**Status Checks (Opcional mas Recomendado):**
- [ ] 10. ✅ Marcar "Require status checks to pass before merging"
- [ ] 11. ✅ Marcar "Require branches to be up to date before merging"
- [ ] 12. Selecionar checks obrigatórios (se houver workflows configurados)
      - Exemplo: `Branch Protection Summary` (do workflow incluído neste PR)

**Outras Proteções:**
- [ ] 13. ✅ Marcar "Require conversation resolution before merging"
- [ ] 14. ✅ Marcar "Require linear history" (opcional, mas recomendado)
- [ ] 15. ✅ Marcar "Include administrators"

**Garantir Segurança:**
- [ ] 16. ⚠️ **NÃO** marcar "Allow force pushes"
- [ ] 17. ⚠️ **NÃO** marcar "Allow deletions"

#### Parte 4: Salvar

- [ ] 18. Rolar até o final da página
- [ ] 19. Clicar em **Create** ou **Save changes**

---

### 🧪 Teste de Verificação

Teste se a proteção está funcionando:

- [ ] 20. Abrir terminal no seu computador
- [ ] 21. Executar comandos de teste:

```bash
git clone https://github.com/wallaceSW11/InvoiceManager.git
cd InvoiceManager
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test direct commit"
git push origin main
```

- [ ] 22. ✅ O push deve **FALHAR** com mensagem de erro sobre proteção de branch
- [ ] 23. Se falhou = **Sucesso!** A proteção está ativa
- [ ] 24. Reverter teste:
```bash
git reset HEAD~1
git checkout test.txt
```

---

### 📚 Testar Fluxo de Pull Request

Teste o fluxo correto de trabalho:

- [ ] 25. Criar branch de teste:
```bash
git checkout -b test/branch-protection
echo "# Test PR" >> TEST_PR.md
git add TEST_PR.md
git commit -m "test: verificar proteção de branch"
git push origin test/branch-protection
```

- [ ] 26. Ir ao GitHub e criar Pull Request
- [ ] 27. Verificar se workflow "Branch Protection Check" executa
- [ ] 28. Fazer merge do PR (ou fechar sem merge)
- [ ] 29. Deletar branch de teste

---

### ✅ Configuração Completa!

Se todos os itens estão marcados, sua branch `main` está protegida!

#### O que acontece agora:

✅ **Ninguém** pode fazer commit direto na `main` (nem admins)  
✅ **Todas** as mudanças devem vir via Pull Request  
✅ **Pelo menos 1** pessoa deve aprovar cada PR  
✅ **Workflows** de CI/CD são executados automaticamente  
✅ **Histórico** fica limpo e rastreável  

#### Como trabalhar agora:

1. Sempre criar uma branch para novas features
2. Fazer commits na branch
3. Push da branch para GitHub
4. Criar Pull Request
5. Aguardar aprovação
6. Fazer merge

---

### 🆘 Ajuda

Se algo não funcionou:
- Verifique se você tem permissão de Admin
- Revise cada passo deste checklist
- Consulte `BRANCH_PROTECTION_GUIDE.md` para detalhes
- Veja os logs do GitHub Actions para erros de workflow

---

### 📞 Suporte Adicional

- [Documentação Completa](BRANCH_PROTECTION_GUIDE.md)
- [Guia Rápido](BRANCH_PROTECTION_QUICK_START.md)
- [GitHub Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)

---

**Data de Criação**: 27 de Outubro de 2025  
**Versão**: 1.0  
**Repositório**: wallaceSW11/InvoiceManager
