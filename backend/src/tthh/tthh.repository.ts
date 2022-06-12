import { Tthh } from './tthh.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { GetTthhFilterDto } from './dto/get-tthh-filter.dto';

@EntityRepository(Tthh)
export class TthhRepository extends Repository<Tthh> {
  // metodo que me permite obtner todos los usuarios
  async getTthhMesAnioAlls(mes: Date) {
    let contador = 0;
    let total = 0;
    let status = false;
    try {
      const tthh = await this.find({
        where: {
          fechaPago: mes,
        },
      });

      tthh.map(item => {
        total += parseFloat(item.total);
        if (item.status === 'PENDIENTE') {
          // console.log(item.status);
          contador++;
        } else {
          contador--;
        }
      });

      if (contador < 100) {
        status = true;
      }

      const dato = {
        status,
        mes,
        total,
        tthh,
      };
      console.log(dato);
      return dato;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTthhMesUserAlls(userId: number): Promise<Tthh[]> {
    const query = this.createQueryBuilder('tthh')
      .orderBy('createdAt', 'DESC')
      .leftJoinAndSelect('tthh.user', 'user');

    // if (userId) {
    //   query.where('tthh.user = :user', { user: userId });
    //   query.andWhere('tthh.status = :status', { status: 'ACTIVE' });
    // }

    // if (mes) {
    //   query.andWhere('tthh.fechaPago = :mes', { mes });
    // }

    // if (limite) {
    //   query.limit(limite);
    // }

    try {
      const venta = await query.getMany();
      return venta;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTthhMesAnioTthhAlls(filterDto: GetTthhFilterDto): Promise<Tthh[]> {
    const { mes, anio } = filterDto;
    const query = this.createQueryBuilder('tthh').leftJoinAndSelect(
      'tthh.user',
      'user',
    );
    // .leftJoinAndSelect('ventames.proveedor', 'proveedor');

    if (mes) {
      query.where('tthh.mes = :mes', { mes });
    }
    if (anio) {
      query.andWhere('tthh.anio = :anio', { anio });
    }

    try {
      const venta = await query.getMany();
      return venta;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
