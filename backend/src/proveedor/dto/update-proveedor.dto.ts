import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { User } from '../../user/user.entity';

export class UpdateProveedorDto {
  @IsString()
  @Length(2, 100)
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  razonSocial: string;

  @IsString()
  @IsOptional()
  direccion: string;

  @IsString()
  @IsOptional()
  telefono: string;

  @IsString()
  @IsOptional()
  numeroCuenta: string;

  @IsString()
  @IsOptional()
  tipoCuenta: string;

  @IsString()
  @IsOptional()
  banco: string;

  userId: User;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsOptional()
  publico: boolean;
}
