import { Length, IsNotEmpty, IsString, IsInt } from 'class-validator';
import { Localidad } from '../../localidad/localidad.entity';

export class CreateFacultadDto {
  @IsString()
  @Length(3, 80, {
    message: 'Facultad Invalidad - Mínimo 3, máximo 80 letras',
  })
  @IsNotEmpty({ message: 'El nombe de la facultad es requerido' })
  nombreFacultad: string;

  @IsInt()
  @IsNotEmpty({ message: 'La extension de la facultad es requerido' })
  idLocalidad: Localidad;
}
