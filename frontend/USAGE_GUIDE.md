# Quick Start Guide - CSV Import & Splitting

## Step-by-Step Usage

### 1. First Time Setup

#### Add a Card
1. Go to **Cards** (from navigation menu)
2. Click **"Adicionar Cartão"** / **"Add Card"**
3. Fill in:
   - Nickname: e.g., "Nubank", "Inter", "XP"
   - Last 4 Digits: e.g., "1234"
4. Click **Save**

#### Add Participants
1. Go to **Participants** (from navigation menu)
2. Click **"Adicionar Participante"** / **"Add Participant"**
3. Fill in:
   - Name: e.g., "João Silva"
   - Phone: e.g., "+5511999999999" (with country code for WhatsApp)
4. Click **Save**
5. Repeat for all family members

### 2. Import Invoice

#### Prepare CSV File
Your CSV file should have this format:
```
31/07;NETFLIX ASSINATURA;45,90
15/08;UBER VIAGEM;32,50
20/08;IFOOD PEDIDO;78,30
```

Format: `DD/MM;DESCRIPTION;AMOUNT`
- Date: Day/Month (year is current year)
- Separator: semicolon (;)
- Decimal: comma (,)

#### Import Process
1. Click **"Importar Fatura"** / **"Import Invoice"** on Home screen
2. **Step 1:**
   - Select Card from dropdown
   - Select Due Date
   - Upload CSV file
   - Click **"Visualizar"** / **"Preview"**
3. **Step 2:**
   - Review transaction list
   - Check total amount
   - Click **"Importar"** / **"Import"**
4. You'll be automatically redirected to the splitting screen

### 3. Split Values

#### Quick Method (Equal Split)
1. Select participants by clicking their name chips
   - Selected participants will have colored outline
2. Click **"Dividir Tudo Igualmente"** / **"Split All Equally"**
   - All transactions will be divided equally among selected participants
3. Review the totals at the bottom
4. Click **"Salvar"** / **"Save"**

#### Manual Method
1. Select participants using the chips
2. For each transaction:
   - Type amount in participant's column, OR
   - Click check icon to toggle participant in/out, OR
   - Click calculator icon to auto-split that transaction
3. Ensure each row total matches (no red background)
4. Click **"Salvar"** / **"Save"**

#### Tips
- **Red background** = Split amounts don't match transaction total
- **Green checkmark** = Participant is included in that transaction
- **Gray circle** = Participant is excluded from that transaction
- Numbers are automatically rounded to 2 decimals
- Last participant gets remainder to ensure exact total match

### 4. Send WhatsApp Messages

1. After saving splits, click **"Gerar Mensagens"** / **"Generate Messages"**
2. A dialog opens with one panel per participant (only those with amounts > 0)
3. For each participant:
   - Click to expand their panel
   - Review the generated message
   - **Option A:** Click **"Copiar"** / **"Copy"** to copy to clipboard
     - Then paste manually in WhatsApp
   - **Option B:** Click **"Enviar no WhatsApp"** / **"Send on WhatsApp"**
     - Opens WhatsApp Web/App with message pre-filled
     - Just click send!

#### Generated Message Example
```
Olá João! 👋

Segue sua parte da fatura do cartão Nubank (*1234):
Vencimento: 31/10/2025

📋 *Suas compras:*
• 15/10/2025 - NETFLIX: R$ 45,90
• 20/10/2025 - UBER: R$ 32,50

💰 *Total: R$ 78,40*
```

### 5. Continue Editing

From the **Home** screen:
- Click **"Continuar"** / **"Continue"** on the "Open Invoice" card
- This takes you back to the splitting screen
- Make changes and save again

## Common Scenarios

### Scenario 1: Some participants don't use certain services
1. Import invoice
2. Select ALL participants
3. For Netflix (only João uses):
   - Uncheck all other participants
   - João gets 100% of Netflix
4. For shared purchases (Uber, iFood):
   - Keep all participants checked
   - Auto-split those transactions

### Scenario 2: Unequal splits
1. Import invoice
2. Select participants
3. For expensive purchase split 70/30:
   - Transaction total: R$ 100,00
   - João: Type 70.00
   - Maria: Type 30.00
4. Table will validate automatically

### Scenario 3: Add participant later
1. Go to Participants → Add new participant
2. Go back to invoice (from Home → Continue)
3. Click new participant's chip
4. Their column appears
5. Adjust splits as needed
6. Save

## Keyboard Shortcuts
- **Tab** between input fields
- **Enter** in number fields moves to next row
- **Ctrl+C** / **Cmd+C** when message is selected (alternative to Copy button)

## Troubleshooting

### CSV Import Issues
- **"Invalid format"**: Check if you're using semicolon (;) as separator
- **"Invalid date"**: Ensure format is DD/MM (e.g., 31/07)
- **"Invalid amount"**: Use comma for decimals (e.g., 45,90 not 45.90)
- **Empty file**: Make sure file has at least one transaction

### Splitting Issues
- **Red background on row**: Sum of splits ≠ transaction total
  - Click calculator icon to auto-fix
- **Can't save**: Not all transactions are valid
  - Check for red backgrounds
  - Ensure all selected participants have values (or uncheck them)

### WhatsApp Issues
- **Button doesn't open WhatsApp**: Check if phone number includes country code (e.g., +55)
- **Message not appearing**: Try Copy button and paste manually

## Best Practices

1. **Consistent Naming**: Use clear card nicknames (avoid generic names)
2. **Phone Format**: Always include country code for WhatsApp integration
3. **Regular Saves**: Save splits before generating messages
4. **Review Messages**: Check generated messages before sending
5. **Backup Data**: Browser LocalStorage can be cleared - consider exporting data (future feature)

## Language Toggle
- Click flag icon in top-right corner
- Switches between Portuguese (pt-BR) and English (en-US)
- Preference is saved in browser

## Dark Mode
- Click theme icon in top-right corner
- Switches between light and dark mode
- Preference is saved in browser
