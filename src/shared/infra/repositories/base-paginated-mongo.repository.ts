import { Model, SortOrder } from 'mongoose';

import {
  BasePaginatedRepository,
  Page,
  Params,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

import { BaseMongoRepository } from './base-mongo.repository';

export abstract class BasePaginatedMongoRepository<T extends object>
  extends BaseMongoRepository<T>
  implements BasePaginatedRepository<T>
{
  constructor(model: Model<T>) {
    super(model);
  }

  async findAllPaginated({
    page = 0,
    size = 10,
    sort,
    sortBy,
    ...filters
  }: Params<T>): Promise<Page<T>> {
    if (isNaN(page)) page = 0;
    if (isNaN(size)) size = 10;

    const sortConfig = { [sortBy]: sort === 'ASC' ? 1 : -1 } as {
      [key: string]: SortOrder;
    };

    const filterConfig: Record<string, any> = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] !== undefined) {
        filterConfig[key] = filters[key as keyof typeof filters];
      }
    });

    const [totalElements, content] = await Promise.all([
      this.model.countDocuments(filterConfig),
      this.model
        .find(filterConfig)
        .sort(sortConfig)
        .skip(page * size)
        .limit(size)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      page: {
        size,
        number: page,
        totalElements,
        totalPages,
      },
    };
  }
}
