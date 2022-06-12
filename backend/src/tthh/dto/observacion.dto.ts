import { IsOptional } from 'class-validator';

export class ObservacionDto {
  @IsOptional()
  observacion: string;
}
