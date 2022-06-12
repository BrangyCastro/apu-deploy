import { Module } from '@nestjs/common';
import { TthhPagosController } from './tthh-pagos.controller';
import { TthhPagosService } from './tthh-pagos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TthhPagosRepository } from './tthh-pagos.repository';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { TthhRepository } from '../tthh/tthh.repository';
import { VentaMesRepository } from '../venta-mes/venta-mes.repository';
import { MailService } from 'src/mail/mail.service';
import { SendMailEntity } from 'src/send-mail/send-mail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TthhPagosRepository,
      UserRepository,
      TthhRepository,
      VentaMesRepository,
      SendMailEntity,
    ]),
    UserModule,
  ],
  controllers: [TthhPagosController],
  providers: [TthhPagosService, MailService],
})
export class TthhPagosModule {}
