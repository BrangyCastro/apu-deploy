import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { TthhPagosRepository } from 'src/tthh-pagos/tthh-pagos.repository';
import { TthhRepository } from 'src/tthh/tthh.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { VentaMesRepository } from 'src/venta-mes/venta-mes.repository';
import { SendMailController } from './send-mail.controller';
import { SendMailEntity } from './send-mail.entity';
import { SendMailService } from './send-mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SendMailEntity,
      UserRepository,
      TthhPagosRepository,
      VentaMesRepository,
      TthhRepository,
    ]),
    UserModule,
  ],
  controllers: [SendMailController],
  providers: [SendMailService, MailService],
})
export class SendMailModule {}
