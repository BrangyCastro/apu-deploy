import { Length, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocalidadDto {
  @IsString()
  @Length(3, 20, {
    message: 'Extensión Invalidad - Mínimo 3, máximo 20 letras',
  })
  @IsNotEmpty({ message: 'La extension es requerido' })
  extension: string;
}
