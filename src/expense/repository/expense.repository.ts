import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseRepository extends BaseRepository<Expense> {
  constructor(private dataSource: DataSource) {
    super(Expense, dataSource);
  }
}
