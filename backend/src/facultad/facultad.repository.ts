import { Repository, EntityRepository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Facultad } from './facultad.entity';
import { CreateFacultadDto } from './dto/create-facultad.dto';

@EntityRepository(Facultad)
export class FacultadRepository extends Repository<Facultad> {
  // Metodo que me permite guardar una facultad con su respectiva loclaidad
  async createFacultad(createFacultadDto: CreateFacultadDto): Promise<void> {
    const { nombreFacultad, idLocalidad } = createFacultadDto;

    const facultad = new Facultad();
    facultad.nombreFacultad = nombreFacultad;
    facultad.localidad = idLocalidad;

    try {
      await facultad.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
