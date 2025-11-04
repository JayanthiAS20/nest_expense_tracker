import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ required: true, type: String, example: `Milk` })
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: Number, example: 12 })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true, type: String, example: 'dairy' })
  @IsString()
  category: string;

  @ApiProperty({ required: true, example: '2025-11-04T14:30:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false, type: String })
  description?: string;
}
