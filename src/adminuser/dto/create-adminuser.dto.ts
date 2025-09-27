import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleType } from 'src/constant/constant-datavalue';
import { CreateSettingDto } from 'src/settings/dto/create-setting.dto';

export class CreateAdminuserDto {
  @ApiProperty({ type: String, required: true, example: 'admin@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Indian mobile number',
    example: '91234567891',
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true, example: 'Admin@123!' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty({
    enum: RoleType,
    required: true,
    example: RoleType.SUPER_ADMIN,
  })
  @IsEnum(RoleType)
  @IsNotEmpty()
  roles: RoleType;

  @IsNumber()
  @IsOptional()
  createdBy?: number;

  @ApiProperty({
    type: CreateSettingDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  settings?: CreateSettingDto;
}
