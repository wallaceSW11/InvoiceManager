export interface Card {
  id: string;
  nickname: string;
  lastFourDigits: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDTO {
  nickname: string;
  lastFourDigits: string;
}

export interface UpdateCardDTO {
  nickname?: string;
  lastFourDigits?: string;
}
