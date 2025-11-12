import type { TransactionSplit } from './TransactionSplit';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  splits: TransactionSplit[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  date: Date;
  description: string;
  amount: number;
}

export interface UpdateTransactionDTO {
  date?: Date;
  description?: string;
  amount?: number;
  splits?: TransactionSplit[];
}
