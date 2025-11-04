import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  DataSource,
  EntityTarget,
  SelectQueryBuilder,
  FindOneOptions,
  FindOptionsOrder,
} from 'typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from '../dto/page.dto';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async findAll(
    options?: FindOptionsWhere<T>,
    orderBy?: keyof T,
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<T[]> {
    const orderOption: FindOptionsOrder<T> = orderBy
      ? ({ [orderBy]: order } as FindOptionsOrder<T>)
      : {};

    return await this.find({
      where: {
        ...options,
        activeStatus: true,
      },
      order: orderOption,
    });
  }

  async findById(condition: FindOptionsWhere<T>): Promise<T | null> {
    return await this.findOne({
      where: {
        ...condition,
        activeStatus: true,
      },
    });
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return await this.save(entity);
  }

  async updateEntity(id: number, data: Partial<T>): Promise<T> {
    await this.update(id, data);
    return this.findById({
      id,
      activeStatus: true,
    } as unknown as FindOptionsWhere<T>);
  }

  async softDeleteById(id: number, data: any): Promise<void> {
    await this.update(id, { activeStatus: false, ...data });
  }

  async paginate(
    pageOptionsDto: PageOptionsDto,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    queryBuilderFn?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<PageDto<T>> {
    const qb = this.createQueryBuilder('entity')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`entity.createdAt`, pageOptionsDto.order);

    if (where) {
      qb.where(where);
    }

    if (queryBuilderFn) {
      queryBuilderFn(qb);
    }

    const [items, total] = await qb.getManyAndCount();
    const meta = new PageMetaDto({ pageOptionsDto, itemCount: total });

    return new PageDto<T>(items, meta);
  }

  findOneWithRelation(
    condition: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T> | null {
    const options: FindOneOptions<T> = {
      where: condition,
      relations,
    };
    return this.findOne(options);
  }
}
