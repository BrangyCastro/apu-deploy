import { IsString, IsOptional } from 'class-validator';
import { TipoPago } from '../../tipo-pago/tipo-pago.entity';
import { User } from '../../user/user.entity';

export class CreateMortuoriaDto {
  @IsString()
  nCuenta: string;

  @IsString()
  tipoCuenta: string;

  @IsString()
  @IsOptional()
  banco: string;

  @IsString()
  @IsOptional()
  concepto: string;

  @IsOptional()
  valorPagar: string;

  @IsOptional()
  valorAfiliado: string;

  @IsOptional()
  nAfiliado: number;

  fecha: Date;

  tipo: TipoPago;

  @IsOptional()
  user: User;

  @IsOptional()
  cedula: string;

  @IsOptional()
  nombres: string;

  @IsOptional()
  celular: string;

  @IsOptional()
  telefono: string;

  @IsOptional()
  correo: string;
}
