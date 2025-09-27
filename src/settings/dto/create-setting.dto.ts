import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Language } from '../../constant/constant-datavalue';

export class CreateSettingDto {
  @ApiProperty({ required: false, examples: Language, enum: Language })
  @IsEnum(Language)
  @IsString()
  @IsOptional()
  language?: Language;

  @ApiProperty({ required: false, example: 'false/true' })
  @IsOptional()
  @IsBoolean()
  isNotificationEnabled?: boolean;

  @ApiProperty({ required: false, example: 'false/true' })
  @IsOptional()
  @IsBoolean()
  isBiometricEnabled?: boolean;
}
