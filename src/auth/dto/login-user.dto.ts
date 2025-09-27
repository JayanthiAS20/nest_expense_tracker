import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { LoginType, RoleType } from '../../constant/constant-datavalue';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'user@example.com',
    description: 'Username can be an email, mobile number, or employee ID.',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String, required: true, example: 'Pass@123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    required: false,
    example: RoleType.USER,
    description:
      'Optional role. Required only if multiple roles are supported.',
  })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    type: String,
    enum: LoginType,
    required: true,
    example: LoginType,
  })
  @IsEnum(LoginType)
  @IsNotEmpty()
  type: LoginType;

  @ApiProperty({
    type: String,
    required: true,
    example: `sample@mail.com/23534645`,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ type: String, required: true, example: 'NewPassword123' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'The password should contain at least 1 uppercase character, 1 lowercase, 1 number and should be at least 8 characters long.',
    },
  )
  password: string;

  @ApiProperty({ type: String, required: true, example: 'NewPassword123' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((e) => e.password !== e.confirmPassword)
  confirmPassword: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'eyJhbGciOiJIUzI1...',
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFirstTimePasswordCreation?: boolean = false;
}
export class ChangePasswordDto extends OmitType(ResetPasswordDTO, ['token']) {
  @ApiProperty({
    type: String,
    required: true,
    example: 'OldPassword123!',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
