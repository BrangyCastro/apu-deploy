import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateApuDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;
}
