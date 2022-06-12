import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetVentasCustomDto {
  @IsOptional()
  @IsNotEmpty()
  mesDescontar: Date;

  @IsOptional()
  @IsNotEmpty()
  status: string;
}
