import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PresupuestoRepository } from './presupuesto.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Presupuesto } from './presupuesto.entity';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import * as fs from 'fs';

@Injectable()
export class PresupuestoService {
  constructor(
    @InjectRepository(PresupuestoRepository)
    private presupuestoRepository: PresupuestoRepository,
  ) {}

  async getPresupuestoPublico(): Promise<Presupuesto[]> {
    const found = this.presupuestoRepository
      .createQueryBuilder('presupuesto')
      .where('presupuesto.status = :status', { status: 'PUBLICO' })
      .orderBy('createdAt', 'DESC')
      .getMany();
    return found;
  }

  async getPresupuestoAlls(): Promise<Presupuesto[]> {
    const found = this.presupuestoRepository
      .createQueryBuilder('presupuesto')
      .orderBy('createdAt', 'DESC')
      .getMany();
    return found;
  }

  async createPresupuesto(
    createPresupuestoDto: CreatePresupuestoDto,
  ): Promise<Presupuesto> {
    return this.presupuestoRepository.createPresupuesto(createPresupuestoDto);
  }

  async updatePdfPresupuesto(id: number, name: string) {
    const found: Presupuesto = await this.presupuestoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      fs.unlinkSync(`./upload/informe/presupuesto/${name}`);
      throw new NotFoundException('El convenio no existe');
    }
    try {
      await this.presupuestoRepository.update(id, {
        archivo: name,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al pdf de presupuesto');
    }
  }

  async updatePresupuesto(
    id: number,
    createPresupuestoDto: CreatePresupuestoDto,
  ): Promise<void> {
    const { observacion, status, titulo } = createPresupuestoDto;

    const found = this.presupuestoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException('El presupuesto no existe');
    }

    const presupuestoAdd = new Presupuesto();
    presupuestoAdd.observacion = observacion;
    presupuestoAdd.status = status;
    presupuestoAdd.titulo = titulo;

    this.presupuestoRepository.update(id, presupuestoAdd);
  }

  async deletePresupuesto(id: number): Promise<void> {
    const result = await this.presupuestoRepository.delete({ id: id });
    if (result.affected === 0) {
      throw new NotFoundException(
        `La presupuesto con el ID: ${id} no se a podido eliminar.`,
      );
    }
  }
}
