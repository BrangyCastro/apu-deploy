import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacultadRepository } from './facultad.repository';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { Facultad } from './facultad.entity';

@Injectable()
export class FacultadService {
  constructor(
    @InjectRepository(FacultadRepository)
    private facultadRepository: FacultadRepository,
  ) {}

  // Metodo para obtener todas las facultades com si reespectiva localidad
  async getFacultadAlls(): Promise<Facultad[]> {
    const facultades = await this.facultadRepository.find({
      order: {
        nombreFacultad: 'ASC',
      },
    });
    return facultades;
  }

  // Metodo para obtener una localidad por id
  async getLocalidad(id: number): Promise<Facultad> {
    const found = this.facultadRepository.findOne({
      where: {
        id: id,
      },
    });
    return found;
  }

  // Metodo que me permite guardar una facultad con su respectiva loclaidad
  async createFacultad(createFacultadDto: CreateFacultadDto): Promise<void> {
    return this.facultadRepository.createFacultad(createFacultadDto);
  }

  // Metodo para actualizar una localidad
  async updateLocalidad(
    id: number,
    createFacultadDto: CreateFacultadDto,
  ): Promise<void> {
    const { nombreFacultad, idLocalidad } = createFacultadDto;

    await this.getLocalidad(id);

    const facultadAdd = new Facultad();
    facultadAdd.nombreFacultad = nombreFacultad;
    facultadAdd.localidad = idLocalidad;

    try {
      this.facultadRepository.update(id, facultadAdd);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Metodo para eliminar una localidad
  async deleteLocalidad(id: number): Promise<void> {
    try {
      const result = await this.facultadRepository.delete({ id: id });
      if (result.affected === 0) {
        throw new NotFoundException(
          `La extension con el ID: ${id} no se a podido eliminar.`,
        );
      }
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2')
        throw new ConflictException(
          'Asegúrese que la facultad que desea eliminar no este vinculada con ninguna USUARIO.',
        );
      throw new InternalServerErrorException();
    }
  }
}
