import { Convenio } from './convenio.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateConvenioDto } from './dto/create-covenio.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Convenio)
export class ConvenioRepository extends Repository<Convenio> {
  async createConvenio(
    createConvenioDto: CreateConvenioDto,
  ): Promise<Convenio> {
    const {
      fechaInicio,
      fechaFin,
      descripcion,
      proveedor,
      descuento,
    } = createConvenioDto;

    const convenio = new Convenio();
    convenio.fechaInicio = fechaInicio;
    convenio.fechaFin = fechaFin;
    convenio.descripcion = descripcion;
    convenio.proveedor = proveedor;
    convenio.descuento = descuento;

    try {
      const p = await convenio.save();
      return p;
    } catch (error) {
      throw new InternalServerErrorException('Error al Guardar el convenio');
    }
  }
}
