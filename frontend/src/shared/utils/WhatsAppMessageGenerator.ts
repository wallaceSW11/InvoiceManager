import type { Invoice, Participant, Card } from '@/core/domain/entities';

export interface WhatsAppMessageData {
  cardName: string;
  dueDate: string;
  participantMessages: Array<{
    participantName: string;
    total: number;
    transactions: Array<{
      date: string;
      description: string;
      amount: number;
    }>;
  }>;
  grandTotal: number;
}

export function generateWhatsAppSummaryMessage(
  invoice: Invoice,
  card: Card,
  participants: Participant[],
  totalsByParticipant: Record<string, number>,
  getSplitValue: (transactionId: string, participantId: string) => number
): string {
  const cardName = `${card.nickname} (*${card.lastFourDigits})`;
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('pt-BR');

  let fullMessage = `📄 RESUMO COMPLETO DA FATURA\n`;
  fullMessage += `Cartão: ${cardName}\n`;
  fullMessage += `Vencimento: ${dueDate}\n`;
  fullMessage += `${'='.repeat(50)}\n\n`;

  const participantsWithValues = participants.filter(
    (p) => (totalsByParticipant[p.id] || 0) !== 0
  );

  participantsWithValues.forEach((participant, index) => {
    const total = totalsByParticipant[participant.id] || 0;
    const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    fullMessage += `👤 ${participant.name.toUpperCase()}\n`;
    fullMessage += `${'-'.repeat(50)}\n`;

    invoice.transactions.forEach((transaction) => {
      const splitAmount = getSplitValue(transaction.id, participant.id);
      if (splitAmount !== 0) {
        const dateStr = new Date(transaction.date).toLocaleDateString('pt-BR');
        const amountStr = splitAmount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        fullMessage += `  • ${dateStr} - ${transaction.description}: ${amountStr}\n`;
      }
    });

    fullMessage += `\n  💰 TOTAL: ${totalStr}\n`;

    if (index < participantsWithValues.length - 1) {
      fullMessage += `\n${'='.repeat(50)}\n\n`;
    }
  });

  const grandTotal = Object.values(totalsByParticipant).reduce((sum, value) => sum + value, 0);
  const grandTotalStr = grandTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  fullMessage += `\n${'='.repeat(50)}\n`;
  fullMessage += `💵 TOTAL GERAL DA FATURA: ${grandTotalStr}`;

  return fullMessage;
}

export function generateWhatsAppIndividualMessage(
  invoice: Invoice,
  card: Card,
  participant: Participant,
  total: number,
  getSplitValue: (transactionId: string, participantId: string) => number
): string {
  const cardName = `${card.nickname} (*${card.lastFourDigits})`;
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('pt-BR');
  const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  let message = `Olá ${participant.name}! 👋\n\n`;
  message += `Segue o resumo da sua parte na fatura do cartão ${cardName}:\n\n`;
  message += `Vencimento: ${dueDate}\n`;
  message += `${'-'.repeat(50)}\n\n`;

  invoice.transactions.forEach((transaction) => {
    const splitAmount = getSplitValue(transaction.id, participant.id);
    if (splitAmount !== 0) {
      const dateStr = new Date(transaction.date).toLocaleDateString('pt-BR');
      const amountStr = splitAmount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      message += `📌 ${dateStr} - ${transaction.description}\n`;
      message += `   ${amountStr}\n\n`;
    }
  });

  message += `${'='.repeat(50)}\n`;
  message += `💰 TOTAL A PAGAR: ${totalStr}\n\n`;
  message += `Por favor, efetue o pagamento até a data de vencimento.`;

  return message;
}
