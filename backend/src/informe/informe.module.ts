import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformeService } from './informe.service';
import { InformeController } from './informe.controller';
import { UserModule } from '../user/user.module';
import { InformeRepository } from './informe.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InformeRepository]), UserModule],
  providers: [InformeService],
  controllers: [InformeController],
})
export class InformeModule {}
