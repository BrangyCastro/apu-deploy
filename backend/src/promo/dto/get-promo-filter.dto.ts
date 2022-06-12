import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetPromoFilterDto {
  @IsOptional()
  @IsNotEmpty()
  limite: number;

  @IsOptional()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  idProveedor: number;

  @IsOptional()
  @IsNotEmpty()
  idUser: number;

  @IsOptional()
  @IsNotEmpty()
  status: number;

  @IsOptional()
  @IsNotEmpty()
  statusProve: string;

  @IsOptional()
  @IsNotEmpty()
  keyboard: string;
}
