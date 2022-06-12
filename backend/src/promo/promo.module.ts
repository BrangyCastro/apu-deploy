import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { PromoRepository } from './promo.repository';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { UserRepository } from '../user/user.repository';
import { ProveedorService } from '../proveedor/proveedor.service';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { ProveedorRepository } from '../proveedor/proveedor.repository';
import { HistorialService } from '../historial/historial.service';
import { HistorialModule } from '../historial/historial.module';
import { HistorialRepository } from '../historial/historial.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromoRepository,
      UserRepository,
      ProveedorRepository,
      HistorialRepository,
    ]),
    UserModule,
    MailModule,
    ProveedorModule,
    HistorialModule,
  ],
  providers: [PromoService, MailService, ProveedorService, HistorialService],
  controllers: [PromoController],
})
export class PromoModule {}
