import type { Card, CreateCardDTO, UpdateCardDTO } from '../../domain/entities';
import type { IRepository } from './IRepository';

export interface ICardRepository extends IRepository<Card> {
  create(dto: CreateCardDTO): Promise<Card>;
  update(id: string, dto: UpdateCardDTO): Promise<Card>;
  findByLastDigits(lastDigits: string): Promise<Card[]>;
}
