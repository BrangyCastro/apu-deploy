import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalidadRepository } from './localidad.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { Localidad } from './localidad.entity';

@Injectable()
export class LocalidadService {
  constructor(
    @InjectRepository(LocalidadRepository)
    private localidadRepository: LocalidadRepository,
  ) {}

  // Metodo para obtener todas las localidades
  async getLocalidadAlls(): Promise<Localidad[]> {
    const found = this.localidadRepository
      .createQueryBuilder('localidad')
      .getMany();
    return found;
  }

  // Metodo para obtener una localidad por id
  async getLocalidad(id: number): Promise<Localidad> {
    const found = this.localidadRepository.findOne({
      where: {
        id: id,
      },
    });
    return found;
  }

  // Metodo para crear una nueva localidad
  async createLocalidad(createLocalidadDto: CreateLocalidadDto): Promise<void> {
    return this.localidadRepository.createLocalidad(createLocalidadDto);
  }

  // Metodo para actualizar una localidad
  async updateLocalidad(
    id: number,
    createLocalidadDto: CreateLocalidadDto,
  ): Promise<Localidad> {
    const { extension } = createLocalidadDto;

    const found = await this.getLocalidad(id);

    const localidadAdd = new Localidad();
    localidadAdd.extension = extension;

    this.localidadRepository.merge(found, localidadAdd);
    const datosLocalidad = await this.localidadRepository.save(found);

    return datosLocalidad;
  }

  // Metodo para eliminar una localidad
  async deleteLocalidad(id: number): Promise<void> {
    try {
      const result = await this.localidadRepository.delete({ id });
      if (result.affected === 0) {
        throw new ConflictException(
          `La extension con el ID: ${id} no se a podido eliminar.`,
        );
      }
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2')
        throw new ConflictException(
          'Asegúrese que la extensión que desea eliminar no este vinculada con ninguna FACULTAD.',
        );
      throw new InternalServerErrorException();
    }
  }
}
