import { Module } from '@nestjs/common';
import { AyudaService } from './ayuda.service';
import { AyudaController } from './ayuda.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AyudaRepository } from './ayuda.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AyudaRepository]), UserModule],
  providers: [AyudaService],
  controllers: [AyudaController],
})
export class AyudaModule {}
