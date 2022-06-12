import { EntityRepository, Repository, getConnection } from 'typeorm';
import { TthhPagos } from './tthh-pagos.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Tthh } from '../tthh/tthh.entity';

@EntityRepository(TthhPagos)
export class TthhPagosRepository extends Repository<TthhPagos> {
  async getTthhPagosAlls(mes: Date) {
    let total = 0;
    let totalPagado = 0;
    let totalPendiente = 0;
    try {
      const tthhTotal = await this.find({
        where: {
          mesDescontar: mes,
        },
      });

      const tthhPagados = await this.createQueryBuilder('tthhPagos')
        .leftJoinAndSelect('tthhPagos.tthh', 'tthh')
        .leftJoinAndSelect('tthh.user', 'user')
        .where('tthhPagos.mesDescontar = :mes', { mes })
        .andWhere('tthh.status = "PAGADO"')
        .getMany();

      tthhPagados.map(item => {
        totalPagado += parseFloat(item.total);
      });

      const tthhDiferente = await this.createQueryBuilder('tthhPagos')
        .leftJoinAndSelect('tthhPagos.tthh', 'tthh')
        .leftJoinAndSelect('tthh.user', 'user')
        .where('tthhPagos.mesDescontar = :mes', { mes })
        .andWhere('tthh.status = "DIFERENCIA"')
        .getMany();

      const tthhRepository = await getConnection().getRepository(Tthh);

      const tthhPendiente: Tthh[] = await tthhRepository.find({
        where: { status: 'PENDIENTE', fechaPago: mes },
      });

      tthhPendiente.map(item => {
        totalPendiente += parseFloat(item.total);
      });

      tthhTotal.map(item => {
        total += parseFloat(item.total);
      });

      const dato = {
        mes,
        total,
        totalPagado,
        totalPendiente,
        tthhPagados,
        tthhDiferente,
        tthhPendiente,
      };
      return dato;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getTthhPagosUserMes(
    mesInicio: Date,
    mesFin: Date,
    id: string,
  ): Promise<TthhPagos[]> {
    try {
      const tthhPagados: TthhPagos[] = await this.createQueryBuilder(
        'tthhPagos',
      )
        .leftJoinAndSelect('tthhPagos.tthh', 'tthh')
        .leftJoinAndSelect('tthh.user', 'user')
        .andWhere('tthhPagos.status = "PUBLICO"')
        .andWhere('user.id = :id', { id })
        .andWhere(
          `tthhPagos.mesDescontar BETWEEN "${mesInicio}" AND "${mesFin}"`,
        )
        .orderBy('tthhPagos.mesDescontar', 'DESC')
        .getMany();

      return tthhPagados;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
