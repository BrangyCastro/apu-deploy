import { IsString } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  cedula: string;

  @IsString()
  clave: string;
}
