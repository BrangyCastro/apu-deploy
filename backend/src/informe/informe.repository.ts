import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Informe } from './informe.entity';
import { CreateInformeDto } from './dto/create-informe.dto';

@EntityRepository(Informe)
export class InformeRepository extends Repository<Informe> {
  async createInforme(createInformeDto: CreateInformeDto): Promise<Informe> {
    const { nombre, fechaFin, fechaInicio, status } = createInformeDto;

    const informe = new Informe();
    informe.nombre = nombre;
    informe.fechaInicio = fechaInicio;
    informe.fechaFin = fechaFin;
    informe.status = status || 'PRIVADO';

    try {
      const p = await informe.save();
      return p;
    } catch (error) {
      throw new InternalServerErrorException('Error al Guardar el informe');
    }
  }
}
