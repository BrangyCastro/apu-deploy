import { Module } from '@nestjs/common';
import { TthhController } from './tthh.controller';
import { TthhService } from './tthh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TthhRepository } from './tthh.repository';
import { UserRepository } from '../user/user.repository';
import { VentaMesRepository } from '../venta-mes/venta-mes.repository';
import { MailService } from '../mail/mail.service';
import { TthhPagosRepository } from '../tthh-pagos/tthh-pagos.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TthhRepository,
      UserRepository,
      VentaMesRepository,
      TthhPagosRepository,
    ]),
    UserModule,
  ],
  controllers: [TthhController],
  providers: [TthhService, MailService],
})
export class TthhModule {}
