import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendMailEntity } from './send-mail.entity';
import { Cron } from '@nestjs/schedule';
import { TthhPagosRepository } from 'src/tthh-pagos/tthh-pagos.repository';
import { TthhRepository } from 'src/tthh/tthh.repository';
import { VentaMesRepository } from 'src/venta-mes/venta-mes.repository';
import { TthhPagos } from 'src/tthh-pagos/tthh-pagos.entity';
import { Tthh } from 'src/tthh/tthh.entity';
import { VentaMes } from 'src/venta-mes/venta-mes.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SendMailService {
  constructor(
    @InjectRepository(SendMailEntity)
    private readonly _sendMailRepository: Repository<SendMailEntity>,
    @InjectRepository(TthhPagosRepository)
    private tthhPagosRepository: TthhPagosRepository,
    @InjectRepository(TthhRepository)
    private tthhRepository: TthhRepository,
    @InjectRepository(VentaMesRepository)
    private ventaMesRepository: VentaMesRepository,
    private mailService: MailService,
  ) {}

  @Cron('0 */15 7-22 * * *')
  async handlePromoExpiration() {
    const sendMail = await this._sendMailRepository.find({ take: 25 });
    if (sendMail.length > 0) {
      console.log(
        '============================================================',
      );
      console.log('ENVIANDO CORREOS ELECTRONICOS PENDIENTES... ' + new Date());
      sendMail.map(async item => {
        const tthhPagos: TthhPagos = await this.tthhPagosRepository.findOne({
          id: item.tthhPagoId,
        });
        if (!tthhPagos) {
          throw new ConflictException('No existe');
        }
        const tthh: Tthh = await this.tthhRepository.findOne({
          id: tthhPagos.tthh.id,
        });
        if (!tthh) {
          throw new ConflictException('No existe');
        }
        const venta: VentaMes[] = await this.ventaMesRepository.find({
          user: tthh.user,
          mesDescontar: tthh.fechaPago,
        });

        const totalTthh = Number(tthh.total);
        const totalTthhPago = Number(tthhPagos.total);

        const dataTemp = {
          tthhPagos,
          tthh,
          venta,
          diferencia: totalTthh - totalTthhPago,
        };

        if (!tthh.user.email) {
          await this._sendMailRepository.delete({ id: item.id });
          return;
        }

        if (tthh.user.status === 'INACTIVE') {
          await this._sendMailRepository.delete({ id: item.id });
          return;
        }

        // Enviamos el correo
        await this.mailService.sendMailReports(dataTemp);
        // Actualizamos el estado de TTHHPAGOS
        await this.tthhPagosRepository.update(
          { id: item.tthhPagoId },
          { email: true },
        );
        // Eliminamos de la tabla SendMail
        await this._sendMailRepository.delete({ id: item.id });

        console.log(item);
        console.log(
          '============================================================',
        );
      });
    } else {
      console.log(
        '============================================================',
      );
      console.log('NO TENEMOS CORREOS PENDIENTES...');
      console.log(
        '============================================================',
      );
    }
  }
}
