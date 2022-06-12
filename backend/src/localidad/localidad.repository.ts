import { Repository, EntityRepository } from 'typeorm';
import { Localidad } from './localidad.entity';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Localidad)
export class LocalidadRepository extends Repository<Localidad> {
  // Metodo para crear una nueva localidad
  async createLocalidad(createLocalidadDto: CreateLocalidadDto): Promise<void> {
    const { extension } = createLocalidadDto;

    const localidad = new Localidad();
    localidad.extension = extension;

    try {
      await localidad.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
