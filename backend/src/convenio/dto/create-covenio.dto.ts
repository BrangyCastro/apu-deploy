import { IsString, IsOptional } from 'class-validator';
import { Proveedor } from '../../proveedor/proveedor.entity';

export class CreateConvenioDto {
  fechaInicio: Date;
  fechaFin: Date;

  @IsString()
  @IsOptional()
  descripcion: string;

  descuento: number;

  proveedor: Proveedor;
}
