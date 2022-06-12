import { IsOptional } from 'class-validator';

export class GetTthhFilterDto {
  @IsOptional()
  mes: string;

  @IsOptional()
  anio: string;

  @IsOptional()
  limite: number;
}
