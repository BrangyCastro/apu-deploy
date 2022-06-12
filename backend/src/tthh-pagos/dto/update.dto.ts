import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  observacion: string;

  @IsOptional()
  @IsNotEmpty()
  total: string;
}
