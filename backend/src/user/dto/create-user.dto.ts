import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
} from 'class-validator';
import { Facultad } from '../../facultad/facultad.entity';
import { Roles } from '../../roles/roles.entity';

export class CreateUserDto {
  @IsString()
  @Length(10, 10, { message: 'Cedula Invalido' })
  @IsNotEmpty({ message: 'El cedula es requerido' })
  cedula: string;

  @IsString()
  @Length(4, 50)
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombres: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  emailPersonal: string;

  @IsString()
  telefono: string;

  @IsString()
  celular: string;

  @IsString()
  @Length(6, 30)
  clave: string;

  facultad: Facultad;

  rol: string;
}
