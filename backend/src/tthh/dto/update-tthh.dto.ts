import { IsOptional } from 'class-validator';

export class UpdateTthhDto {
  @IsOptional()
  aporte: string;

  @IsOptional()
  total: string;

  @IsOptional()
  observacion: string;
}
