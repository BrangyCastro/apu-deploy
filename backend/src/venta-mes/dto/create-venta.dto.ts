import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateVentaDto {
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

  @Optional()
  codigo: string;

  @IsNotEmpty()
  mesDescontar: Date;

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
