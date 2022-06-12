import { IsString } from 'class-validator';

export class CreateTipoPagoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;
}
