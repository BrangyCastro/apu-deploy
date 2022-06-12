import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetExtensionFilterDto {
  @IsOptional()
  @IsNotEmpty()
  status: string;
}
