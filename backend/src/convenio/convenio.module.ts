import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvenioController } from './convenio.controller';
import { ConvenioService } from './convenio.service';
import { UserModule } from '../user/user.module';
import { ConvenioRepository } from './convenio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConvenioRepository]), UserModule],
  controllers: [ConvenioController],
  providers: [ConvenioService],
})
export class ConvenioModule {}
