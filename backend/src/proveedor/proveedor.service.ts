import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProveedorRepository } from './proveedor.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { GetProveedorFilterDto } from './dto/get-proveedor-filter.dto';
import * as fs from 'fs';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(ProveedorRepository)
    private proveedorRepository: ProveedorRepository,
  ) {}

  async getProveedorAlls(
    filterDto: GetProveedorFilterDto,
  ): Promise<Proveedor[]> {
    return this.proveedorRepository.getProveedorAlls(filterDto);
  }

  async getProveedorById(id: number): Promise<Proveedor> {
    const found: Proveedor = await this.proveedorRepository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });

    if (!found) {
      throw new ConflictException(
        `El detalle del proveedor no se a encontrado`,
      );
    }

    return found;
  }

  async getProveedorAndUserById(
    id: number,
    userId: number,
  ): Promise<Proveedor> {
    const found: Proveedor = await this.proveedorRepository.findOne({
      where: {
        id: id,
        user: userId,
        status: 'ACTIVE',
      },
    });

    if (!found) {
      throw new ConflictException(
        `El detalle del proveedor no se a encontrado`,
      );
    }

    return found;
  }

  async createProveedor(createProveedorDto: CreateProveedorDto): Promise<void> {
    return this.proveedorRepository.createProveedor(createProveedorDto);
  }

  async updateImgProveedor(id: number, name: string) {
    const found: Proveedor = await this.proveedorRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      fs.unlinkSync(`./upload/proveedor/${name}`);
      throw new NotFoundException('El proveedor no existe');
    }

    if (found.url) {
      fs.unlinkSync(`./upload/proveedor/${found.url}`);
    }

    try {
      await this.proveedorRepository.update(id, {
        url: name,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al guardar la img del proveedor',
      );
    }
  }

  // Metodo para actualizar un uausrio
  async updateProveedor(
    id: number,
    updateProveedorDto: UpdateProveedorDto,
  ): Promise<void> {
    const {
      nombre,
      direccion,
      telefono,
      banco,
      tipoCuenta,
      numeroCuenta,
      userId,
      descripcion,
      publico,
      razonSocial,
    } = updateProveedorDto;

    const found = await this.getProveedorById(id);

    const provAdd = new Proveedor();
    provAdd.nombre = nombre;
    provAdd.direccion = direccion;
    provAdd.telefono = telefono;
    provAdd.banco = banco;
    provAdd.tipoCuenta = tipoCuenta;
    provAdd.numeroCuenta = numeroCuenta;
    provAdd.user = userId;
    provAdd.descripcion = descripcion;
    provAdd.publico = publico;
    provAdd.razonSocial = razonSocial;

    try {
      // this.proveedorRepository.merge(found, provAdd);
      // const datosUser = await this.proveedorRepository.save(found);
      // return datosUser;
      await this.proveedorRepository.update(found, provAdd);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya existe un provedor con ese nombre');
      } else {
        throw new InternalServerErrorException('Error al guardar el proveedor');
      }
    }
  }

  async deleteProveedor(id: number, status: string): Promise<void> {
    const userExist = await this.proveedorRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException('La empresa no existe');
    }

    try {
      await this.proveedorRepository.update(id, { status });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al guardar el proveedor');
    }
  }
}
