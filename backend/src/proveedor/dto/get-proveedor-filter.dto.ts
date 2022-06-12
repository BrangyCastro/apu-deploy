import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetProveedorFilterDto {
  @IsOptional()
  @IsNotEmpty()
  publico: string;

  @IsOptional()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  noActivo: string;

  @IsOptional()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNotEmpty()
  keyboard: string;
}
