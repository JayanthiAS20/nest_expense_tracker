import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseAudit } from '../../common/entities/base-audit.entity';
import { Gender, RoleType, Status } from '../../constant/constant-datavalue';
import { Setting } from '../../settings/entities/setting.entity';
import { Expense } from '../../expense/entities/expense.entity';

@Index('full_text_search', ['name', 'email'], { fulltext: true })
@Entity({ name: 'user' })
export class User extends BaseAudit {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Index()
  @Column({ nullable: true, unique: true })
  mobile: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  roles: RoleType;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ default: false })
  isMobileVerified: boolean;

  @Column({ default: false })
  blockUser: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: true })
  activeStatus: boolean;

  @OneToOne(() => Setting)
  @JoinColumn()
  settings: Setting;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender?: Gender;

  @OneToMany(() => Expense, (expense) => expense.user)
  expense: Expense[];
}
