import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsString,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { Gender, RoleType } from '../../constant/constant-datavalue';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Full name of the user',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email format is invalid',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Indian mobile number',
    example: '91234567890',
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'User password',
    example: 'SecurePass@123',
  })
  @IsString()
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password?: string;

  @ApiProperty({
    enum: RoleType,
    required: true,
  })
  @IsEnum(RoleType)
  @IsNotEmpty()
  roles: RoleType;

  @ApiProperty({
    enum: Gender,
    required: false,
    description: 'Gender must be male or female',
  })
  @IsOptional()
  gender?: Gender;

  @IsOptional()
  createdBy?: number;
}
