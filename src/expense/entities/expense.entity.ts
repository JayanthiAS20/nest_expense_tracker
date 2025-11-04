import { User } from '../../users/entities/user.entity';
import { BaseAudit } from '../../common/entities/base-audit.entity';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

@Entity()
@Index(['user', 'activeStatus'])
export class Expense extends BaseAudit {
  @Column()
  @Index()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  @Index()
  category: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  activeStatus: boolean;

  @ManyToOne(() => User, (user) => user.expense, { onDelete: 'CASCADE' })
  user: User;
}
