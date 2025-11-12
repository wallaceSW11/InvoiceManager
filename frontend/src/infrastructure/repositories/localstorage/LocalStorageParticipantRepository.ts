import type {
  Participant,
  CreateParticipantDTO,
  UpdateParticipantDTO
} from '@/core/domain/entities';
import type { IParticipantRepository } from '@/core/repositories/interfaces';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

interface SerializedParticipant {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageParticipantRepository
  extends BaseLocalStorageRepository<Participant>
  implements IParticipantRepository
{
  constructor() {
    super('invoicemanager:participants');
  }

  protected serialize(participant: Participant): SerializedParticipant {
    return {
      id: participant.id,
      name: participant.name,
      phoneNumber: participant.phoneNumber,
      createdAt: participant.createdAt.toISOString(),
      updatedAt: participant.updatedAt.toISOString()
    };
  }

  protected deserialize(data: unknown): Participant {
    const serialized = data as SerializedParticipant;
    return {
      id: serialized.id,
      name: serialized.name,
      phoneNumber: serialized.phoneNumber,
      createdAt: new Date(serialized.createdAt),
      updatedAt: new Date(serialized.updatedAt)
    };
  }

  async create(dto: CreateParticipantDTO): Promise<Participant> {
    return super.create(dto);
  }

  async update(id: string, dto: UpdateParticipantDTO): Promise<Participant> {
    return super.update(id, dto);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Participant | null> {
    const participants = await this.findAll();
    return participants.find((p) => p.phoneNumber === phoneNumber) || null;
  }
}
