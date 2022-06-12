import { IsOptional, IsString } from 'class-validator';

export class CreateInformeDto {
  @IsString()
  @IsOptional()
  nombre: string;

  fechaInicio: Date;

  fechaFin: Date;

  @IsString()
  @IsOptional()
  status: string;
}
