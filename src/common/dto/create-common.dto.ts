import { IsNumber, IsOptional } from 'class-validator';

export class CreateCommonDto {
  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
