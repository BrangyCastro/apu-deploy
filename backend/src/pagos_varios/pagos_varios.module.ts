import { Module } from '@nestjs/common';
import { PagosVariosService } from './pagos_varios.service';
import { PagosVariosController } from './pagos_varios.controller';
import { PagosVariosRepository } from './pagos_varios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { TipoPagoRepository } from '../tipo-pago/tipo-pago.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PagosVariosRepository,
      UserRepository,
      TipoPagoRepository,
    ]),
    UserModule,
  ],
  providers: [PagosVariosService],
  controllers: [PagosVariosController],
})
export class PagosVariosModule {}
