import { IsString, IsOptional } from 'class-validator';

export class CreatePresupuestoDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  observacion: string;

  @IsString()
  @IsOptional()
  status: string;
}
