import { IsString, Length } from 'class-validator';

export class PassUserAdminDto {
  @IsString()
  @Length(6, 30)
  claveNue: string;
}
