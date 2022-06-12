import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AyudaCuotaController } from './ayuda-cuota.controller';
import { AyudaCuotaRepository } from './ayuda-cuota.repository';
import { AyudaCuotaService } from './ayuda-cuota.service';

@Module({
  imports: [TypeOrmModule.forFeature([AyudaCuotaRepository])],
  controllers: [AyudaCuotaController],
  providers: [AyudaCuotaService],
})
export class AyudaCuotaModule {}
