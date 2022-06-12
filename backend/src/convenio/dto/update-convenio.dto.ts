import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConvenioDto {
  fechaInicio: Date;
  fechaFin: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  descuento: number;
}
