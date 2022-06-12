import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class UpdateVentaDto {
  @IsNotEmpty()
  userId: number;

  @Optional()
  proveedor: number;

  @Optional()
  apuExtension: number;

  @Optional()
  producto: string;

  @IsNotEmpty()
  mesPago: string;

  @Optional()
  factura: string;

  @IsNotEmpty()
  fechaEmision: Date;

  @IsNotEmpty()
  totalVenta: number;

  @IsNotEmpty()
  cuotaMeses: number;

  @IsNotEmpty()
  totalMeses: number;

  @IsNotEmpty()
  valorCuota: number;

  @IsNotEmpty()
  valorPendiente: number;
}
