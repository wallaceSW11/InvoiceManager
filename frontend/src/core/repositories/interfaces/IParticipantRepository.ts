import type {
  Participant,
  CreateParticipantDTO,
  UpdateParticipantDTO
} from '../../domain/entities';
import type { IRepository } from './IRepository';

export interface IParticipantRepository extends IRepository<Participant> {
  create(dto: CreateParticipantDTO): Promise<Participant>;
  update(id: string, dto: UpdateParticipantDTO): Promise<Participant>;
  findByPhoneNumber(phoneNumber: string): Promise<Participant | null>;
}
