import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageParticipantRepository } from '../LocalStorageParticipantRepository';
import type { CreateParticipantDTO, UpdateParticipantDTO } from '@/core/domain/entities';

describe('LocalStorageParticipantRepository', () => {
  let repository: LocalStorageParticipantRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageParticipantRepository();
  });

  describe('create', () => {
    it('should create a new participant', async () => {
      const dto: CreateParticipantDTO = {
        name: 'John Doe',
        phoneNumber: '1234567890'
      };

      const participant = await repository.create(dto);

      expect(participant.id).toBeTruthy();
      expect(participant.name).toBe('John Doe');
      expect(participant.phoneNumber).toBe('1234567890');
      expect(participant.createdAt).toBeInstanceOf(Date);
      expect(participant.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist participant to localStorage', async () => {
      const dto: CreateParticipantDTO = {
        name: 'Jane Doe',
        phoneNumber: '9876543210'
      };

      await repository.create(dto);
      const stored = localStorage.getItem('invoicemanager:participants');

      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no participants exist', async () => {
      const participants = await repository.findAll();
      expect(participants).toEqual([]);
    });

    it('should return all participants', async () => {
      await repository.create({ name: 'Person 1', phoneNumber: '1111111111' });
      await repository.create({ name: 'Person 2', phoneNumber: '2222222222' });

      const participants = await repository.findAll();

      expect(participants).toHaveLength(2);
      expect(participants[0]?.name).toBe('Person 1');
      expect(participants[1]?.name).toBe('Person 2');
    });
  });

  describe('findById', () => {
    it('should return null when participant not found', async () => {
      const participant = await repository.findById('non-existent');
      expect(participant).toBeNull();
    });

    it('should return participant by id', async () => {
      const created = await repository.create({
        name: 'Test Person',
        phoneNumber: '1234567890'
      });

      const found = await repository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Test Person');
    });
  });

  describe('update', () => {
    it('should update participant name', async () => {
      const created = await repository.create({
        name: 'Old Name',
        phoneNumber: '1234567890'
      });

      const dto: UpdateParticipantDTO = { name: 'New Name' };
      const updated = await repository.update(created.id, dto);

      expect(updated.name).toBe('New Name');
      expect(updated.phoneNumber).toBe('1234567890');
    });

    it('should update participant phone number', async () => {
      const created = await repository.create({
        name: 'Person',
        phoneNumber: '1234567890'
      });

      const dto: UpdateParticipantDTO = { phoneNumber: '9876543210' };
      const updated = await repository.update(created.id, dto);

      expect(updated.phoneNumber).toBe('9876543210');
    });

    it('should throw error when participant not found', async () => {
      await expect(repository.update('non-existent', { name: 'Test' })).rejects.toThrow(
        'not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete participant by id', async () => {
      const created = await repository.create({
        name: 'Person',
        phoneNumber: '1234567890'
      });

      await repository.delete(created.id);

      const participants = await repository.findAll();
      expect(participants).toHaveLength(0);
    });

    it('should throw error when participant not found', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow('not found');
    });
  });

  describe('findByPhoneNumber', () => {
    it('should return participant with matching phone number', async () => {
      await repository.create({ name: 'Person 1', phoneNumber: '1234567890' });
      await repository.create({ name: 'Person 2', phoneNumber: '9876543210' });

      const participant = await repository.findByPhoneNumber('1234567890');

      expect(participant).not.toBeNull();
      expect(participant?.name).toBe('Person 1');
      expect(participant?.phoneNumber).toBe('1234567890');
    });

    it('should return null when no match', async () => {
      await repository.create({ name: 'Person', phoneNumber: '1234567890' });

      const participant = await repository.findByPhoneNumber('9999999999');

      expect(participant).toBeNull();
    });

    it('should return null when no participants exist', async () => {
      const participant = await repository.findByPhoneNumber('1234567890');
      expect(participant).toBeNull();
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize correctly', async () => {
      const dto: CreateParticipantDTO = {
        name: 'Test Person',
        phoneNumber: '1234567890'
      };

      const created = await repository.create(dto);
      const found = await repository.findById(created.id);

      expect(found).toEqual(created);
    });
  });
});
