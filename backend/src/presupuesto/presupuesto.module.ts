import { Module } from '@nestjs/common';
import { PresupuestoController } from './presupuesto.controller';
import { PresupuestoService } from './presupuesto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PresupuestoRepository } from './presupuesto.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PresupuestoRepository]), UserModule],
  controllers: [PresupuestoController],
  providers: [PresupuestoService],
})
export class PresupuestoModule {}
