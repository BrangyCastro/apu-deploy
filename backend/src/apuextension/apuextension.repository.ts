import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ApuExtension } from './apuextension.entity';
import { CreateApuDto } from './dto/create-apu.dto';
import { GetExtensionFilterDto } from './dto/get-extension-filter.dto';

@EntityRepository(ApuExtension)
export class ApuExtensionRepository extends Repository<ApuExtension> {
  async createApu(createApuDto: CreateApuDto): Promise<ApuExtension> {
    const { nombre, descripcion } = createApuDto;

    const apu = new ApuExtension();
    apu.nombre = nombre;
    apu.descripcion = descripcion;

    try {
      const p = await apu.save();
      return p;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al Guardar la APU Extension.',
      );
    }
  }

  async getApuAlls(filterDto: GetExtensionFilterDto): Promise<ApuExtension[]> {
    const { status } = filterDto;
    try {
      const prov: ApuExtension[] = await this.createQueryBuilder('apuextension')
        .where('apuextension.status = :status', { status })
        .getMany();

      return prov;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al obtener las extensiones.',
      );
    }
  }
}
