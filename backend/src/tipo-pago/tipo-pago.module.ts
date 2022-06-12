import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPagoController } from './tipo-pago.controller';
import { TipoPagoRepository } from './tipo-pago.repository';
import { TipoPagoService } from './tipo-pago.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPagoRepository]), UserModule],

  controllers: [TipoPagoController],
  providers: [TipoPagoService],
})
export class TipoPagoModule {}
