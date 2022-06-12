import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TthhPagosRepository } from './tthh-pagos.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { TthhRepository } from '../tthh/tthh.repository';
import { TthhPagos } from './tthh-pagos.entity';
import { UpdateDto } from './dto/update.dto';
import { Tthh } from 'src/tthh/tthh.entity';
import { CreateTthhPdfDto } from 'src/tthh/dto/create-tthh-pdf.dto';
import { VentaMes } from 'src/venta-mes/venta-mes.entity';
import { VentaMesRepository } from '../venta-mes/venta-mes.repository';
import { MailService } from '../mail/mail.service';

import * as moment from 'moment';
import { SendMailEntity } from 'src/send-mail/send-mail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TthhPagosService {
  constructor(
    @InjectRepository(TthhPagosRepository)
    private tthhPagosRepository: TthhPagosRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TthhRepository)
    private tthhRepository: TthhRepository,
    @InjectRepository(VentaMesRepository)
    private ventaMesRepository: VentaMesRepository,
    @InjectRepository(SendMailEntity)
    private readonly _sendMailRepository: Repository<SendMailEntity>,
    private mailService: MailService,
  ) {}

  async getTthhPagosAlls(mes: Date) {
    return this.tthhPagosRepository.getTthhPagosAlls(mes);
  }

  async getTthhPagosUserMes(
    mesInicio: Date,
    mesFin: Date,
    id: string,
  ): Promise<TthhPagos[]> {
    return this.tthhPagosRepository.getTthhPagosUserMes(mesInicio, mesFin, id);
  }

  async getTthhPagosUserMesReporte(mesInicio: Date, mesFin: Date, id: number) {
    try {
      const datosTthh = [];
      const user: User = await this.userRepository.findOne({ id });
      const tthhPagados: TthhPagos[] = await this.tthhPagosRepository
        .createQueryBuilder('tthhPagos')
        .leftJoinAndSelect('tthhPagos.tthh', 'tthh')
        .leftJoinAndSelect('tthh.user', 'user')
        .andWhere('tthhPagos.status = "PUBLICO"')
        .andWhere('user.id = :id', { id })
        .andWhere(
          `tthhPagos.mesDescontar BETWEEN "${mesInicio}" AND "${mesFin}"`,
        )
        .orderBy('tthhPagos.mesDescontar', 'DESC')
        .getMany();
      await Promise.all(
        tthhPagados.map(async item => {
          const venta: VentaMes[] = await this.ventaMesRepository.find({
            where: {
              mesDescontar: item.mesDescontar,
              user: id,
            },
          });
          const totalTthhPago = Number(item.total);
          const totalTthh = Number(item.tthh.total);
          const dataTemp = {
            tthh: item,
            venta,
            diferencia: totalTthh - totalTthhPago,
          };
          datosTthh.push(dataTemp);
        }),
      );
      datosTthh.sort((a, b) => {
        a = new Date(a.tthh.mesDescontar);
        b = new Date(b.tthh.mesDescontar);
        return a > b ? -1 : a < b ? 1 : 0;
      });

      const datos = {
        user,
        datosTthh,
      };

      return datos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getTthhPagosId(id: number): Promise<TthhPagos> {
    const tthhPagos = await this.tthhPagosRepository.findOne({ id });
    if (!tthhPagos) {
      throw new ConflictException('El detalle del cobro no existe.');
    }
    return tthhPagos;
  }

  async createTthhPagoCSV(data): Promise<number> {
    const { obser, file, mes } = data;
    let contador = 0;
    await Promise.all(
      file.map(async data => {
        const foundUser: User = await this.userRepository.findOne({
          select: ['id', 'status'],
          where: {
            cedula: data.CEDULA,
          },
        });

        if (foundUser) {
          const found = await this.tthhRepository.findOne({
            select: ['id', 'total', 'user'],
            where: { user: { id: foundUser.id }, fechaPago: mes },
            relations: ['user'],
          });

          if (found) {
            if (found.total === this.cantidadDouble(data.TOTAL)) {
              await this.tthhRepository.update(found.id, {
                status: 'PAGADO',
              });
            } else if (
              found.total < this.cantidadDouble(data.TOTAL) ||
              found.total > this.cantidadDouble(data.TOTAL)
            ) {
              await this.tthhRepository.update(found.id, {
                status: 'DIFERENCIA',
              });
            }

            const tthhPagos = new TthhPagos();
            tthhPagos.mesDescontar = mes;
            tthhPagos.observacion = obser;
            tthhPagos.total = this.cantidadDouble(data.TOTAL);
            tthhPagos.tthh = found;

            try {
              contador++;
              await tthhPagos.save();
            } catch (error) {
              console.log(error);
              throw new NotFoundException();
            }
          }
        }
      }),
    );

    return contador;
  }

  async createTthhReview(allVentas): Promise<any[]> {
    const results = [];
    // let temporal = [];
    const sinRepetidos = allVentas.filter(
      (valorActual, indiceActual, arreglo) =>
        arreglo.findIndex(
          valorDelArreglo =>
            JSON.stringify(valorDelArreglo.CEDULA) ==
            JSON.stringify(valorActual.CEDULA),
        ) !== indiceActual,
    );

    if (sinRepetidos.isNotEmpty) {
      return sinRepetidos;
    } else {
      await Promise.all(
        allVentas.map(async (data, i) => {
          let dataTemp = { ...data, id: i, user: true };

          const query = await this.tthhRepository
            .createQueryBuilder('tthh')
            .leftJoinAndSelect('tthh.user', 'user');
          query.where('user.cedula = :ci', {
            ci: data.CEDULA,
          });
          const user = await query.getOne();

          if (!user) {
            dataTemp = { ...dataTemp, user: false };
            await results.push(dataTemp);
          }
          if (!data.TOTAL) {
            await results.push(dataTemp);
          }
        }),
      );
    }
    return results;
  }

  async createPdf(pfdDto: CreateTthhPdfDto) {
    const { userId, mes } = pfdDto;

    const user: User = await this.userRepository.findOne({
      id: userId,
    });

    const tthh = await this.tthhRepository.findOne({
      user,
      fechaPago: mes,
    });

    const venta = await this.tthhPagosRepository
      .createQueryBuilder('tthhPagos')
      .innerJoinAndSelect('tthhPagos.tthh', 'tthh')
      .innerJoinAndSelect('tthh.user', 'user')
      .where('tthhPagos.mesDescontar = :mes', { mes })
      .andWhere('tthhPagos.status = "PUBLICO"')
      .andWhere('user.id = :id', { id: user.id })
      .getOne();

    const ventaMes: VentaMes[] = await this.ventaMesRepository.find({
      user: user,
      mesDescontar: mes,
    });

    const totalTthh = Number(tthh.total);
    const totalTthhPago = Number(venta.total);

    const fechaActual = moment().format('DD/MM/YYYY');

    const data = {
      user,
      venta,
      ventaMes,
      tthh,
      total: totalTthh.toFixed(2),
      diferencia: totalTthh - totalTthhPago,
      fecha: fechaActual,
    };

    // handlebars.registerHelper('ifMeses', (mesTotal, mesCuota) => {
    //   if (mesTotal > 0) {
    //     return new handlebars.SafeString(
    //       '<div>' + mesCuota + '/' + mesTotal + '</div>',
    //     );
    //   } else {
    //     return new handlebars.SafeString('<div>------</div>');
    //   }
    // });

    // handlebars.registerHelper('ifDiferencia', diferencia => {
    //   if (diferencia > 0 || diferencia < 0) {
    //     return new handlebars.SafeString(
    //       '<tr style="background-color: #ed1d24"><td style="text-align: left; font-weight: bold;">Diferencia:</td><td style="text-align: right;">' +
    //         diferencia +
    //         '</td></tr>',
    //     );
    //   } else {
    //     return '';
    //   }
    // });

    // handlebars.registerHelper('lower', function(aString) {
    //   return aString.toLowerCase();
    // });

    try {
      // const templateHtml = fs.readFileSync(
      //   path.join(process.cwd(), 'documents/index.hbs'),
      //   'utf8',
      // );

      // const template = handlebars.compile(templateHtml);
      // const html = template(data);

      // const pdfPath = `upload/reporte/${user.cedula}-${venta.mesDescontar}.pdf`;

      // const footer = `
      // <div style="display: flex; width: 100%; justify-content: center; flex-direction: column;" >
      //   <div style="display: flex; flex-direction: column;">
      //     <div style=" justify-content: center; text-align: center;">
      //       <span style="display: inline-block;  font-size: 10px;">
      //         Web:
      //         <a href="http://aputransparencia.com/">www.aputransparencia.com</a>
      //       </span>
      //       <span style="display: inline-block; text-align: center; font-size: 10px; margin-left: 20px;">
      //         E-mail: <a href="mailto:info.apu@uleam.edu.ec">info.apu@uleam.edu.ec</a>
      //       </span>
      //     </div>
      //     <span style="font-size: 10px; text-align: center; margin-top: 5px">APU ULEAM © Copyright 2020, Todos los derechos reservados</span>
      //     <span style="font-size: 10px; text-align: center; margin-top: 3px">Manta - Manabí - Ecuador</span>
      //   </div>
      //     <span style="font-size: 10px; margin-left: 10px;">Fecha: ${fechaActual}</span>
      // </div>
      // `;

      // const options = {
      //   format: 'A4',
      //   headerTemplate: '<p></p>',
      //   footerTemplate: footer,
      //   displayHeaderFooter: true,
      //   margin: {
      //     bottom: '100px',
      //   },
      //   printBackground: true,
      //   path: pdfPath,
      // };

      // const browser = await puppeteer.launch({
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //   headless: false,
      // });

      // const page = await browser.newPage();

      // await page.setContent(html);
      // await page.pdf(options);
      // await browser.close();
      return data;
    } catch (error) {
      console.log('Our Error', error);
    }

    //---------------------------__________-------------

    // const content = await this.compile('index', data);

    // pdf
    //   .create(content)
    //   .toFile(`upload/reporte/${user.cedula}-${venta.mes}.pdf`, (err, res) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       filename = res;
    //     }
    //   }),
    //   // await Promise.all();

    // return filename;
  }

  async sendEmailReport(id: number) {
    const tthhPagos: TthhPagos = await this.tthhPagosRepository.findOne({ id });
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

    await this.mailService.sendMailReports(dataTemp);

    await this.tthhPagosRepository.update(id, { email: true });
  }

  async sendEmailReportAlls(data: any) {
    await Promise.all(
      data.map(async item => {
        await this._sendMailRepository.insert({ tthhPagoId: item.tthhPago_id });
      }),
    );
  }

  async updateStatusTthhPagos(file): Promise<number> {
    await Promise.all(
      file.map(async data => {
        const found: User = await this.userRepository.findOne({
          select: ['id', 'status', 'email'],
          where: {
            cedula: data.cedula,
          },
        });
        if (found) {
          if (found.status === 'ACTIVE') {
            const tthh = new TthhPagos();
            tthh.status = 'PUBLICO';
            try {
              this.tthhPagosRepository.update(data.tthhPago_id, tthh);
            } catch (error) {
              throw new InternalServerErrorException('Error al actualizar.');
            }
          }
        }
      }),
    );

    return 0;
  }

  async updateTthhPagos(id: number, updateDto: UpdateDto) {
    const { status, observacion, total } = updateDto;

    const found = await this.tthhPagosRepository.findOne({ id });

    if (!found) {
      throw new NotFoundException('El pago no se a encontrado');
    }

    const tthhPagos = new TthhPagos();
    tthhPagos.status = status;
    tthhPagos.observacion = observacion;
    tthhPagos.total = total;

    try {
      await this.tthhPagosRepository.update(id, tthhPagos);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteTthhPagosAlls(allTthh: TthhPagos[]): Promise<number> {
    let contador = 0;
    await Promise.all(
      allTthh.map(async item => {
        try {
          const result = await this.tthhPagosRepository.delete({ id: item.id });
          contador++;
          if (result.affected === 0) {
            throw new NotFoundException(`No se a podido eliminar.`);
          }
        } catch (error) {
          console.log(error);
          if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            throw new NotFoundException(
              'No se puede eliminar el registro. Debe primero eliminarlo en la tabla de Talento Humano.',
            );
          }
          throw new NotFoundException('Ocurrio un error al eliminar.');
        }
      }),
    );
    return contador;
  }

  async deleteTthhPagosId(id: number): Promise<void> {
    try {
      const result = await this.tthhPagosRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`No se a podido eliminar.`);
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new NotFoundException(
          'No se puede eliminar el registro. Debe primero eliminarlo en la tabla de Talento Humano.',
        );
      }
      throw new NotFoundException('Ocurrio un error al eliminar.');
    }
  }

  cantidadDouble(cantidad) {
    const cantidad1 = cantidad.replace('.', '');
    const cantidad2 = cantidad1.replace('.', '');
    const cantidad3 = cantidad2.replace(',', '.');
    return cantidad3;
  }
}
