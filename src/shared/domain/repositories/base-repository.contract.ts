export abstract class BaseRepository<T extends object> {
  abstract insert(entity: T): Promise<void>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract update(id: string, fields: Partial<T>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
