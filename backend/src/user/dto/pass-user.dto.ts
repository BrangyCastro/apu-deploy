import { IsString, Matches, Length } from 'class-validator';

export class PassUserDto {
  @IsString()
  @Length(6, 30)
  claveAnt: string;

  @IsString()
  @Length(6, 30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener al menos 6 pero no más de 30 caracteres, una mayuscula y numeros.',
  })
  claveNue: string;
}
