import { IsString, IsNotEmpty, IsEmail, Length, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(6, 40)
  @IsEmail({}, { message: 'El correo institucional es Invalido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @IsString()
  @IsEmail({}, { message: 'EL correo personal es Invalido' })
  emailPersonal: string;

  @IsString()
  telefono: string;

  @IsString()
  celular: string;

  @IsInt()
  @IsNotEmpty({ message: 'La facultad es requerido' })
  facultad: number;
}
