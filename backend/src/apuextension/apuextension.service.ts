import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateApuDto } from './dto/create-apu.dto';
import { ApuExtensionRepository } from './apuextension.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ApuExtension } from './apuextension.entity';
import { GetExtensionFilterDto } from './dto/get-extension-filter.dto';

@Injectable()
export class ApuextensionService {
  constructor(
    @InjectRepository(ApuExtensionRepository)
    private apuRepository: ApuExtensionRepository,
  ) {}

  async getApuAlls(filterDto: GetExtensionFilterDto): Promise<ApuExtension[]> {
    return this.apuRepository.getApuAlls(filterDto);
  }

  async getApuId(id: number): Promise<ApuExtension> {
    const found = await this.apuRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException('La extensión no existe');
    }

    return found;
  }

  async createApu(createApuDto: CreateApuDto): Promise<ApuExtension> {
    return this.apuRepository.createApu(createApuDto);
  }

  async updateApu(id: number, createApuDto: CreateApuDto): Promise<void> {
    const { nombre, descripcion } = createApuDto;

    await this.getApuId(id);

    const apuAdd = new ApuExtension();
    apuAdd.nombre = nombre;
    apuAdd.descripcion = descripcion;

    try {
      this.apuRepository.update(id, apuAdd);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteApu(id: number, status: string): Promise<void> {
    const userExist = await this.apuRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException('La extension no existe');
    }

    try {
      await this.apuRepository.update(id, { status });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar el proveedor');
    }
  }
}
