import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultadService } from './facultad.service';
import { FacultadController } from './facultad.controller';
import { FacultadRepository } from './facultad.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([FacultadRepository]), UserModule],
  providers: [FacultadService],
  controllers: [FacultadController],
})
export class FacultadModule {}
