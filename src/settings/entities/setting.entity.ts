import { Language } from '../../constant/constant-datavalue';
import { BaseAudit } from '../../common/entities/base-audit.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'setting', schema: 'public' })
export class Setting extends BaseAudit {
  @Column({
    type: 'enum',
    enum: Language,
    default: Language.ENGLISH,
  })
  language: Language;

  @Column({ default: false })
  isEmailNotificationEnabled: boolean;

  @Column({ default: false })
  isNotificationEnabled: boolean;

  @Column({ default: false })
  isBiometricEnabled: boolean;
}
