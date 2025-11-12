import { describe, it, expect } from 'vitest';
import {
  generateWhatsAppSummaryMessage,
  generateWhatsAppIndividualMessage
} from '../WhatsAppMessageGenerator';
import { SplitMode, InvoiceStatus } from '@/core/domain/enums';
import type { Invoice, Participant, Card } from '@/core/domain/entities';

describe('WhatsAppMessageGenerator', () => {
  const mockCard: Card = {
    id: 'card-1',
    nickname: 'Cartão Principal',
    lastFourDigits: '1234',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockParticipants: Participant[] = [
    {
      id: 'participant-1',
      name: 'Wallace',
      phoneNumber: '11987654321',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'participant-2',
      name: 'Ferreira',
      phoneNumber: '11912345678',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const mockInvoice: Invoice = {
    id: 'invoice-1',
    cardId: 'card-1',
    dueDate: new Date('2024-02-15'),
    status: InvoiceStatus.PENDING,
    transactions: [
      {
        id: 'transaction-1',
        date: new Date('2024-01-20'),
        description: 'Mercado',
        amount: 20000, // R$ 200.00
        splitMode: SplitMode.EQUAL,
        splits: [
          { participantId: 'participant-1', amount: 10000 },
          { participantId: 'participant-2', amount: 10000 }
        ]
      },
      {
        id: 'transaction-2',
        date: new Date('2024-01-22'),
        description: 'Farmácia',
        amount: 7263, // R$ 72.63
        splitMode: SplitMode.CUSTOM,
        splits: [
          { participantId: 'participant-1', amount: 3263 },
          { participantId: 'participant-2', amount: 4000 }
        ]
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const totalsByParticipant = {
    'participant-1': 13263, // R$ 132.63
    'participant-2': 14000 // R$ 140.00
  };

  const getSplitValue = (transactionId: string, participantId: string): number => {
    const transaction = mockInvoice.transactions.find((t) => t.id === transactionId);
    if (!transaction) return 0;
    const split = transaction.splits.find((s) => s.participantId === participantId);
    return split?.amount || 0;
  };

  describe('generateWhatsAppSummaryMessage', () => {
    it('should generate complete summary message with header', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      expect(message).toContain('📄 RESUMO COMPLETO DA FATURA');
      expect(message).toContain('Cartão: Cartão Principal (*1234)');
      expect(message).toContain('Vencimento: 15/02/2024');
    });

    it('should include all participants with their totals', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      expect(message).toContain('👤 WALLACE');
      expect(message).toContain('💰 TOTAL: R$ 132,63');

      expect(message).toContain('👤 FERREIRA');
      expect(message).toContain('💰 TOTAL: R$ 140,00');
    });

    it('should list all transactions for each participant', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      // Wallace's transactions
      expect(message).toContain('20/01/2024 - Mercado: R$ 100,00');
      expect(message).toContain('22/01/2024 - Farmácia: R$ 32,63');

      // Ferreira's transactions
      expect(message).toContain('20/01/2024 - Mercado: R$ 100,00');
      expect(message).toContain('22/01/2024 - Farmácia: R$ 40,00');
    });

    it('should include grand total', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      expect(message).toContain('💵 TOTAL GERAL DA FATURA: R$ 272,63');
    });

    it('should include proper separators', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      expect(message).toContain('='.repeat(50));
      expect(message).toContain('-'.repeat(50));
    });

    it('should only include participants with non-zero totals', () => {
      const totalsWithZero = {
        'participant-1': 13263,
        'participant-2': 0
      };

      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsWithZero,
        getSplitValue
      );

      expect(message).toContain('👤 WALLACE');
      expect(message).not.toContain('👤 FERREIRA');
    });

    it('should format currency correctly', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      // Check BRL currency format (R$ X,XX)
      expect(message).toMatch(/R\$\s\d+,\d{2}/);
      expect(message).not.toContain('R$ .');
      expect(message).not.toContain('R$.');
    });

    it('should format dates correctly in pt-BR', () => {
      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        getSplitValue
      );

      // Check DD/MM/YYYY format
      expect(message).toContain('15/02/2024');
      expect(message).toContain('20/01/2024');
      expect(message).toContain('22/01/2024');
    });

    it('should skip transactions with zero split amount', () => {
      const customGetSplitValue = (transactionId: string, participantId: string): number => {
        if (transactionId === 'transaction-1' && participantId === 'participant-1') {
          return 0;
        }
        return getSplitValue(transactionId, participantId);
      };

      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        mockParticipants,
        totalsByParticipant,
        customGetSplitValue
      );

      // Should not contain Wallace's Mercado transaction
      const wallaceSection = message.split('👤 FERREIRA')[0];
      expect(wallaceSection).not.toContain('Mercado');
    });

    it('should handle single participant', () => {
      const singleParticipant = [mockParticipants[0]];
      const singleTotal = { 'participant-1': 13263 };

      const message = generateWhatsAppSummaryMessage(
        mockInvoice,
        mockCard,
        singleParticipant,
        singleTotal,
        getSplitValue
      );

      expect(message).toContain('👤 WALLACE');
      expect(message).not.toContain('👤 FERREIRA');
      expect(message).toContain('💵 TOTAL GERAL DA FATURA: R$ 132,63');
    });
  });

  describe('generateWhatsAppIndividualMessage', () => {
    it('should generate personalized greeting', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toContain('Olá Wallace! 👋');
    });

    it('should include card and due date information', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toContain('Cartão Principal (*1234)');
      expect(message).toContain('Vencimento: 15/02/2024');
    });

    it('should list only participant transactions', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toContain('20/01/2024 - Mercado');
      expect(message).toContain('R$ 100,00');
      expect(message).toContain('22/01/2024 - Farmácia');
      expect(message).toContain('R$ 32,63');
    });

    it('should show total to pay', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toContain('💰 TOTAL A PAGAR: R$ 132,63');
    });

    it('should include payment instruction', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toContain('Por favor, efetue o pagamento até a data de vencimento');
    });

    it('should format currency correctly', () => {
      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        13263,
        getSplitValue
      );

      expect(message).toMatch(/R\$\s\d+,\d{2}/);
    });

    it('should skip transactions with zero amount for participant', () => {
      const customGetSplitValue = (transactionId: string, participantId: string): number => {
        if (transactionId === 'transaction-1') {
          return 0;
        }
        return getSplitValue(transactionId, participantId);
      };

      const message = generateWhatsAppIndividualMessage(
        mockInvoice,
        mockCard,
        mockParticipants[0],
        3263,
        customGetSplitValue
      );

      expect(message).not.toContain('Mercado');
      expect(message).toContain('Farmácia');
    });
  });
});
