import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialRepository } from './historial.repository';
import { HistorialService } from './historial.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialRepository])],
  providers: [HistorialService],
  exports: [HistorialService],
})
export class HistorialModule {}
