import { Promo } from './promo.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePromoDto } from './dto/create-promo.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';

@EntityRepository(Promo)
export class PromoRepository extends Repository<Promo> {
  async createPromo(createPromoDto: CreatePromoDto): Promise<Promo> {
    const {
      titulo,
      descripcion,
      proveedor,
      fechaInicio,
      fechaFin,
      status,
    } = createPromoDto;

    const promo = new Promo();
    promo.titulo = titulo;
    promo.descripcion = descripcion;
    promo.proveedor = proveedor;
    promo.fechaInicio = fechaInicio || null;
    promo.fechaFin = fechaFin || null;
    promo.status = status;

    try {
      const p = await promo.save();
      return p;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al Guardar el usuario');
    }
  }

  // metodo que me permite obtner todos los usuarios
  async getPromoLimitId(
    filterDto: GetPromoFilterDto,
  ): Promise<Promo[] | Promo> {
    const {
      limite,
      id,
      idProveedor,
      idUser,
      status,
      keyboard,
      statusProve,
    } = filterDto;
    const query = this.createQueryBuilder('promo')
      .orderBy('promo.status', 'DESC')
      .addOrderBy('promo.createdAt', 'DESC')
      .leftJoinAndSelect('promo.proveedor', 'proveedor')
      .leftJoinAndSelect('proveedor.user', 'user');

    if (limite) {
      query.limit(limite);
    }

    if (id) {
      query.where('promo.id = :id', { id });
      const venta = await query.getOne();
      if (!venta) {
        throw new ConflictException(
          `El detalle de la promoción no se a encontrado`,
        );
      }
      return venta;
    }

    if (idProveedor) {
      query.where('promo.proveedor = :id', { id: idProveedor });
    }

    if (idUser) {
      query.where('user.id = :id', { id: idUser });
      query.andWhere('proveedor.status = "ACTIVE"');
      query.andWhere('proveedor.publico = true');
    }

    if (status) {
      query.where('promo.status = :status', { status });
    }

    if (statusProve) {
      query.where('promo.status = :status', { status: statusProve });
      query.andWhere('proveedor.status = "ACTIVE"');
      query.andWhere('proveedor.publico = true');
    }

    if (keyboard) {
      query.where('proveedor.nombre LIKE :nombre ', {
        nombre: '%' + keyboard + '%',
      });
      query.andWhere('promo.status = "PUBLICO"');
    }

    try {
      const venta = await query.getMany();
      return venta;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
