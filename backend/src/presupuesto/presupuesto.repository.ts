import { EntityRepository, Repository } from 'typeorm';
import { Presupuesto } from './presupuesto.entity';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Presupuesto)
export class PresupuestoRepository extends Repository<Presupuesto> {
  async createPresupuesto(
    createPresupuestoDto: CreatePresupuestoDto,
  ): Promise<Presupuesto> {
    const { observacion, status, titulo } = createPresupuestoDto;

    const presupuesto = new Presupuesto();
    presupuesto.observacion = observacion;
    presupuesto.status = status || 'PRIVADO';
    presupuesto.titulo = titulo;

    try {
      const p = await presupuesto.save();
      return p;
    } catch (error) {
      throw new InternalServerErrorException('Error al Guardar el presupuesto');
    }
  }
}
