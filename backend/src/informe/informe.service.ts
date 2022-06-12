import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InformeRepository } from './informe.repository';
import { Informe } from './informe.entity';
import { CreateInformeDto } from './dto/create-informe.dto';
import * as fs from 'fs';

@Injectable()
export class InformeService {
  constructor(
    @InjectRepository(InformeRepository)
    private informeRepository: InformeRepository,
  ) {}

  async getInformePublico(): Promise<Informe[]> {
    const found = this.informeRepository
      .createQueryBuilder('informe')
      .where('informe.status = :status', { status: 'PUBLICO' })
      .orderBy('informe.createdAt', 'DESC')
      .getMany();
    return found;
  }

  async getInformeAlls(): Promise<Informe[]> {
    const found = this.informeRepository
      .createQueryBuilder('informe')
      .orderBy('createdAt', 'DESC')
      .getMany();
    return found;
  }

  async createInforme(createInformeDto: CreateInformeDto): Promise<Informe> {
    return this.informeRepository.createInforme(createInformeDto);
  }

  async updatePdfInforme(id: number, name: string) {
    const found: Informe = await this.informeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      fs.unlinkSync(`./upload/informe/gestion/${name}`);
      throw new NotFoundException('El informe no existe');
    }
    try {
      await this.informeRepository.update(id, {
        archivo: name,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al gusradar el pdf de informe',
      );
    }
  }

  async updateInforme(
    id: number,
    createInformeDto: CreateInformeDto,
  ): Promise<void> {
    const { nombre, fechaFin, fechaInicio, status } = createInformeDto;

    const found = this.informeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException('El presupuesto no existe');
    }

    const informeAdd = new Informe();
    informeAdd.nombre = nombre;
    informeAdd.fechaInicio = fechaInicio;
    informeAdd.fechaFin = fechaFin;
    informeAdd.status = status;

    this.informeRepository.update(id, informeAdd);
  }

  async deleteInforme(id: number): Promise<void> {
    const found: Informe = await this.informeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException('El informe no existe');
    }
    const result = await this.informeRepository.delete({ id: id });
    fs.unlinkSync(`./upload/informe/gestion/${found.archivo}`);
    if (result.affected === 0) {
      throw new NotFoundException(
        `La informe con el ID: ${id} no se a podido eliminar.`,
      );
    }
  }
}
