import { IsString, IsOptional } from 'class-validator';
import { Proveedor } from '../../proveedor/proveedor.entity';

export class CreatePromoDto {
  @IsString()
  @IsOptional()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsOptional()
  fechaInicio: Date;

  @IsOptional()
  fechaFin: Date;

  @IsOptional()
  status: string;

  proveedor: Proveedor;
}
