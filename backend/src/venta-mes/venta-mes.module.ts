import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaMesController } from './venta-mes.controller';
import { VentaMesService } from './venta-mes.service';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { VentaMesRepository } from './venta-mes.repository';
import { ProveedorRepository } from '../proveedor/proveedor.repository';
import { ApuExtensionRepository } from '../apuextension/apuextension.repository';
import { TthhRepository } from '../tthh/tthh.repository';
import { HistorialService } from 'src/historial/historial.service';
import { HistorialRepository } from 'src/historial/historial.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaMesRepository,
      UserRepository,
      ProveedorRepository,
      ApuExtensionRepository,
      TthhRepository,
      HistorialRepository,
    ]),
    UserModule,
  ],
  controllers: [VentaMesController],
  providers: [VentaMesService, HistorialService],
})
export class VentaMesModule {}
