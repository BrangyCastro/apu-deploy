import { Module } from '@nestjs/common';
import { LocalidadController } from './localidad.controller';
import { LocalidadService } from './localidad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalidadRepository } from './localidad.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocalidadRepository]), UserModule],
  controllers: [LocalidadController],
  providers: [LocalidadService],
})
export class LocalidadModule {}
