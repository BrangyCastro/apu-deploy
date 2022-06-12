import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { ConvenioRepository } from './convenio.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConvenioDto } from './dto/create-covenio.dto';
import { Convenio } from './convenio.entity';
import * as fs from 'fs';
import { UpdateConvenioDto } from './dto/update-convenio.dto';

@Injectable()
export class ConvenioService {
  constructor(
    @InjectRepository(ConvenioRepository)
    private covenioRepository: ConvenioRepository,
  ) {}

  async createConvenio(
    createConvenioDto: CreateConvenioDto,
  ): Promise<Convenio> {
    return this.covenioRepository.createConvenio(createConvenioDto);
  }

  async updatePdfConvenio(id: number, name: string) {
    const found: Convenio = await this.covenioRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      fs.unlinkSync(`./upload/convenios/${name}`);
      throw new ConflictException('El convenio no existe');
    }
    try {
      await this.covenioRepository.update(id, {
        archivo: name,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al pdf la imagen.');
    }
  }

  async getConvenioIdProveedor(id: number): Promise<Convenio> {
    try {
      const convenios: Convenio = await this.covenioRepository.findOne({
        where: { proveedor: id, status: 'ACTIVE' },
        order: {
          fechaInicio: 'DESC',
        },
      });

      return convenios;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getConvenioAllsIdProveedor(id: number): Promise<Convenio[]> {
    try {
      const convenios: Convenio[] = await this.covenioRepository.find({
        where: { proveedor: id },
        order: {
          fechaInicio: 'DESC',
        },
      });

      return convenios;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteConvenio(id: number): Promise<void> {
    const userExist = await this.covenioRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException('El convenio no existe.');
    }

    await this.covenioRepository.delete(id);
  }

  async updateConvenio(
    id: number,
    convenioUserDto: UpdateConvenioDto,
  ): Promise<void> {
    const {
      fechaInicio,
      fechaFin,
      descripcion,
      descuento,
      status,
    } = convenioUserDto;

    const found = await this.covenioRepository.findOne(id);

    if (!found) {
      throw new ConflictException('El convenio no existe.');
    }

    const convenioAdd = new Convenio();
    convenioAdd.fechaInicio = fechaInicio;
    convenioAdd.fechaFin = fechaFin;
    convenioAdd.descripcion = descripcion;
    convenioAdd.descuento = descuento;
    convenioAdd.status = status;

    try {
      await this.covenioRepository.update(id, convenioAdd);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
