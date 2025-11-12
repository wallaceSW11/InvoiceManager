export interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateParticipantDTO {
  name: string;
  phoneNumber: string;
}

export interface UpdateParticipantDTO {
  name?: string;
  phoneNumber?: string;
}
