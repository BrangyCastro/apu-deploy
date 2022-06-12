import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTthhPdfDto {
  @IsOptional()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsNotEmpty()
  mes: string;

  @IsOptional()
  @IsNotEmpty()
  anio: number;
}
