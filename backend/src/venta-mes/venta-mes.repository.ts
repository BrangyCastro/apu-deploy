import { Repository, EntityRepository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { VentaMes } from './venta-mes.entity';
import { GetVentasFilterDto } from './dto/get-ventas-filter.dto';
import { GetVentasCustomDto } from './dto/get-ventas-custom.dto';

@EntityRepository(VentaMes)
export class VentaMesRepository extends Repository<VentaMes> {
  // metodo que me permite obtner todos los usuarios
  async getVentaMesAnioProveedorAlls(
    filterDto: GetVentasFilterDto,
  ): Promise<VentaMes[] | { VentaMes: VentaMes[]; total } | VentaMes> {
    const { mesDescontar, proveedor, status, apuExtension, id } = filterDto;
    const query = this.createQueryBuilder('ventames')
      .leftJoinAndSelect('ventames.user', 'user')
      .leftJoinAndSelect('user.facultad', 'facultad')
      .leftJoinAndSelect('facultad.localidad', 'localidad')
      .leftJoinAndSelect('ventames.apuExtension', 'apuExtension')
      .leftJoinAndSelect('ventames.proveedor', 'proveedor')
      .leftJoinAndSelect('proveedor.convenio', 'convenio')
      .orderBy('user.nombres', 'ASC');

    if (mesDescontar) {
      let suma: { sum: 0 };
      query.where('ventames.mesDescontar = :mesDescontar', {
        mesDescontar,
      });

      if (proveedor) {
        query.andWhere('ventames.proveedor = :proveedor', { proveedor });
        suma = await this.createQueryBuilder('ventames')
          .select('SUM(ventames.valorCuota)', 'suma')
          .where('ventames.mesDescontar = :mesDescontar', {
            mesDescontar,
          })
          .andWhere('ventames.proveedor = :proveedor', { proveedor })
          .getRawOne();
        const venta: VentaMes[] = await query.getMany();

        let ventaFormat = [];
        venta.map(item => {
          ventaFormat.push({ ...item, nombres: item.user.nombres });
        });

        return {
          VentaMes: ventaFormat,
          total: suma,
        };
      }

      if (apuExtension) {
        query.andWhere('ventames.apuExtension = :apuExtension', {
          apuExtension,
        });
        suma = await this.createQueryBuilder('ventames')
          .select('SUM(ventames.valorCuota)', 'suma')
          .where('ventames.mesDescontar = :mesDescontar', {
            mesDescontar,
          })
          .andWhere('ventames.apuExtension = :apuExtension', { apuExtension })
          .getRawOne();
        const venta: VentaMes[] = await query.getMany();
        let ventaFormat = [];
        venta.map(item => {
          ventaFormat.push({ ...item, nombres: item.user.nombres });
        });
        return {
          VentaMes: ventaFormat,
          total: suma,
        };
      }

      suma = await this.createQueryBuilder('ventames')
        .select('SUM(ventames.valorCuota)', 'suma')
        .where('ventames.mesDescontar = :mesDescontar', {
          mesDescontar,
        })
        .getRawOne();

      const venta: VentaMes[] = await query.getMany();

      if (suma.sum === null || venta.length <= 0) {
        return {
          VentaMes: [],
          total: null,
        };
      }

      let ventaFormat = [];
      venta.map(item => {
        ventaFormat.push({ ...item, nombres: item.user.nombres });
      });

      return {
        VentaMes: ventaFormat,
        total: suma,
      };
    }

    if (status) {
      query.andWhere('ventames.status = :status', { status });
    }

    if (id) {
      query.where('ventames.id = :id', { id });
      const venta = await query.getOne();
      return venta;
    }

    try {
      const venta = await query.getMany();
      return venta;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getVentaCustomAlls(filterDto: GetVentasCustomDto): Promise<VentaMes[]> {
    const { mesDescontar, status } = filterDto;

    const venta = await this.createQueryBuilder('ventames')
      .select('userId', 'idDocente')
      .addSelect('mesDescontar', 'mes')
      .addSelect('SUM(valorCuota)', 'total')
      .leftJoin('ventames.user', 'user')
      .addSelect('user.cedula', 'cedula')
      .addSelect('user.nombres', 'nombres')
      .addSelect('user.status', 'status')
      .where('ventames.mesDescontar = :mes', { mes: mesDescontar })
      .andWhere('ventames.status = :status', { status })
      .addGroupBy('ventames.userId')
      .getRawMany();

    return venta;
  }

  // Metodo que permite obtener todos las ventas que coincidan con mes y usuario
  async getVentaMesUserAlls(mes: Date, userId: string): Promise<VentaMes[]> {
    try {
      const venta: VentaMes[] = await this.find({
        where: {
          mesDescontar: mes,
          user: userId,
        },
      });

      return venta;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // metodo que me permite obtner todos los usuarios
  async getVentaMesAnioAlls(
    mesDescontar: Date,
    anio: string,
  ): Promise<VentaMes[]> {
    try {
      const venta: VentaMes[] = await this.find({
        where: {
          mesDescontar,
          anio: anio,
        },
      });

      return venta;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getVentaMesAnioAllsCuston(mesDescontar: Date) {
    const todaVentas = [];
    try {
      const venta: VentaMes[] = await this.find({
        where: {
          mesDescontar,
        },
      });

      venta.map(item => {
        const data = {
          cedula: item.user.cedula,
          nombres: item.user.nombres,
          proveedor: item.proveedor?.nombre || item.apuExtension?.nombre,
          producto: item.producto,
          cuota: item.valorCuota,
          mes: item.mesDescontar,
        };
        todaVentas.push(data);
      });

      return todaVentas;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
