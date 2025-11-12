import type { SplitMode } from '../enums';

export interface TransactionSplit {
  participantId: string;
  amount: number;
  mode: SplitMode;
}

export interface CreateTransactionSplitDTO {
  participantId: string;
  amount: number;
  mode?: SplitMode;
}
