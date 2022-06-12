import { Facultad } from '../../facultad/facultad.entity';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class UpdateUserDetailsDto {
  @IsString()
  @Length(4, 20)
  @IsNotEmpty({ message: 'La cedula es requerido' })
  cedula: string;

  @IsString()
  @Length(4, 20)
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombres: string;

  @IsString()
  @Length(6, 40)
  @IsEmail({}, { message: 'Correo Invalido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @IsString()
  @IsEmail({}, { message: 'Correo Invalido' })
  emailPersonal: string;

  @IsString()
  telefono: string;

  @IsString()
  celular: string;

  @IsString()
  @Length(6, 40)
  @IsNotEmpty({ message: 'La facultad es requerido' })
  facultad: Facultad;
}
