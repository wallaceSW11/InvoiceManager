import type { IRepository } from '@/core/repositories/interfaces';

export abstract class BaseLocalStorageRepository<
  T extends { id: string; createdAt: Date; updatedAt: Date }
> implements IRepository<T>
{
  protected readonly storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  protected getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return this.deserializeArray(parsed);
  }

  protected saveAll(items: T[]): void {
    const serialized = this.serializeArray(items);
    localStorage.setItem(this.storageKey, JSON.stringify(serialized));
  }

  protected serializeArray(items: T[]): unknown[] {
    return items.map((item) => this.serialize(item));
  }

  protected deserializeArray(data: unknown[]): T[] {
    return data.map((item) => this.deserialize(item));
  }

  protected abstract serialize(item: T): unknown;
  protected abstract deserialize(data: unknown): T;

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  async findAll(): Promise<T[]> {
    return this.getAll();
  }

  async findById(id: string): Promise<T | null> {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = this.getAll();
    const now = new Date();

    const newItem = {
      ...entity,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    } as T;

    items.push(newItem);
    this.saveAll(items);

    return newItem;
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = {
      ...items[index],
      ...entity,
      id,
      updatedAt: new Date()
    } as T;

    items[index] = updatedItem;
    this.saveAll(items);

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }

    this.saveAll(filtered);
  }
}
