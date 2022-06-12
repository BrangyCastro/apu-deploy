import { IsOptional, IsNotEmpty } from 'class-validator';
import { Proveedor } from '../../proveedor/proveedor.entity';
import { ApuExtension } from '../../apuextension/apuextension.entity';

export class GetVentasFilterDto {
  @IsOptional()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  mesDescontar: Date;

  @IsOptional()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  proveedor: Proveedor;

  @IsOptional()
  @IsNotEmpty()
  apuExtension: ApuExtension;
}
