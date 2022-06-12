import { Repository, EntityRepository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { GetProveedorFilterDto } from './dto/get-proveedor-filter.dto';

@EntityRepository(Proveedor)
export class ProveedorRepository extends Repository<Proveedor> {
  // metodo que me permite obtner todos los proveedores
  async getProveedorAlls(
    filterDto: GetProveedorFilterDto,
  ): Promise<Proveedor[]> {
    const { publico, status, noActivo, userId, keyboard } = filterDto;

    const query = await this.createQueryBuilder('proveedor')
      .leftJoinAndSelect('proveedor.user', 'user')
      .leftJoinAndSelect(
        'proveedor.convenio',
        'convenio',
        'convenio.status = "ACTIVE"',
      );
    // .where();

    if (publico) {
      query
        .where('proveedor.status = "ACTIVE"')
        .andWhere('proveedor.publico = :public', {
          public: Boolean(JSON.parse(publico)),
        });
    }

    if (status) {
      query.where('proveedor.status = :status', { status });
    }

    // if (noActivo) {
    //   query.where('proveedor.status = :status', { status: noActivo });
    // }

    if (userId) {
      query.where('proveedor.userId = :userId', { userId });
      query.andWhere('proveedor.status = "ACTIVE"');
      query.andWhere('proveedor.publico = true');
    }

    if (keyboard) {
      query.where('proveedor.nombre LIKE :nombre ', {
        nombre: '%' + keyboard + '%',
      });
      query.andWhere('proveedor.publico = true');
    }

    try {
      const prov = await query.getMany();
      return prov;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Metodo que me permite crear un Proveedor
  async createProveedor(createProveedorDto: CreateProveedorDto) {
    const {
      nombre,
      direccion,
      telefono,
      numeroCuenta,
      tipoCuenta,
      banco,
      userId,
      descripcion,
      razonSocial,
    } = createProveedorDto;

    const provCreate = new Proveedor();
    provCreate.nombre = nombre;
    provCreate.user = userId || null;
    provCreate.direccion = direccion || '';
    provCreate.telefono = telefono || '';
    provCreate.numeroCuenta = numeroCuenta || '';
    provCreate.tipoCuenta = tipoCuenta || '';
    provCreate.banco = banco || '';
    provCreate.descripcion = descripcion || '';
    provCreate.razonSocial = razonSocial || '';

    try {
      await provCreate.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya existe un provedor con ese nombre');
      } else {
        throw new InternalServerErrorException('Error al guardar el proveedor');
      }
    }
  }
}
