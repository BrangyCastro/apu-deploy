import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetUserFilterDto {
  @IsOptional()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  cedula: string;

  @IsOptional()
  @IsNotEmpty()
  afiliados: string;

  @IsOptional()
  @IsNotEmpty()
  noAfiliados: string;

  @IsOptional()
  @IsNotEmpty()
  rol: string;
}
