import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/domain/repositories/base-repository.contract';

export class BaseMongoRepository<T extends object>
  implements BaseRepository<T>
{
  constructor(private model: Model<T>) {}

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

  async update(id: string, entity: T): Promise<void> {
    await this.model.findByIdAndUpdate(id, entity);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      _id: id,
    });
  }
}
