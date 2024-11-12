import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/domain/repositories/base-repository.contract';

export abstract class BaseMongoRepository<T extends object>
  implements BaseRepository<T>
{
  constructor(protected model: Model<T>) {}

  async insert(entity: T): Promise<void> {
    const model = new this.model(entity);
    await model.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  findAll(): Promise<T[]> {
    return this.model.find();
  }

  async update(id: string, fields: Partial<T>): Promise<void> {
    await this.model.findByIdAndUpdate({ _id: id }, fields);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      _id: id,
    });
  }
}
