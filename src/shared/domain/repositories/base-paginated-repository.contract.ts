import { BaseRepository } from './base-repository.contract';

export type Page<T extends object> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type SortOrder = 'ASC' | 'DESC';

export type Params<T extends object> = {
  page: number;
  size: number;
  sort: SortOrder;
  sortBy: keyof T;
} & { [key in keyof T]?: string };

export abstract class BasePaginatedRepository<
  T extends object,
> extends BaseRepository<T> {
  abstract findAllPaginated(params: Params<T>): Promise<Page<T>>;
}
