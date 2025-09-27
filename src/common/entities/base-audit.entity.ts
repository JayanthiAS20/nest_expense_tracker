import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';

// Common entity for all the tables
export abstract class BaseAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @IsDate()
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  @IsDate()
  deletedAt?: Date;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  updatedBy?: number;
}
