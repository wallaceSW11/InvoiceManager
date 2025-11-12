import type { Card, CreateCardDTO, UpdateCardDTO } from '@/core/domain/entities';
import type { ICardRepository } from '@/core/repositories/interfaces';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

interface SerializedCard {
  id: string;
  nickname: string;
  lastFourDigits: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageCardRepository
  extends BaseLocalStorageRepository<Card>
  implements ICardRepository
{
  constructor() {
    super('invoicemanager:cards');
  }

  protected serialize(card: Card): SerializedCard {
    return {
      id: card.id,
      nickname: card.nickname,
      lastFourDigits: card.lastFourDigits,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString()
    };
  }

  protected deserialize(data: unknown): Card {
    const serialized = data as SerializedCard;
    return {
      id: serialized.id,
      nickname: serialized.nickname,
      lastFourDigits: serialized.lastFourDigits,
      createdAt: new Date(serialized.createdAt),
      updatedAt: new Date(serialized.updatedAt)
    };
  }

  async create(dto: CreateCardDTO): Promise<Card> {
    return super.create(dto);
  }

  async update(id: string, dto: UpdateCardDTO): Promise<Card> {
    return super.update(id, dto);
  }

  async findByLastDigits(lastDigits: string): Promise<Card[]> {
    const cards = await this.findAll();
    return cards.filter((card) => card.lastFourDigits === lastDigits);
  }
}
