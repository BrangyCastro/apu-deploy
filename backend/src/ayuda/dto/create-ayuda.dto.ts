import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateAyudaDto {
  @IsString()
  @IsNotEmpty()
  banco: string;

  @IsString()
  @IsOptional()
  tipoCuenta: string;

  @IsString()
  @IsOptional()
  nCuenta: string;

  @IsString()
  @IsOptional()
  concepto: string;

  @IsNumberString()
  @IsOptional()
  valorSolicitado: number;

  @IsNumberString()
  @IsOptional()
  valorDepositar: number;

  @IsNumberString()
  @IsOptional()
  valorCuota: number;

  @IsNumberString()
  @IsOptional()
  total: number;

  @IsNumberString()
  @IsOptional()
  porcentaje: number;

  @IsNumberString()
  @IsOptional()
  totalMeses: number;

  @IsOptional()
  fechaEmision: Date;

  user: User;
}
