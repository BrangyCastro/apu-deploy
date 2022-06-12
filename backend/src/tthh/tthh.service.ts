import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as moment from 'moment';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { TthhRepository } from './tthh.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { VentaMesRepository } from '../venta-mes/venta-mes.repository';
import { VentaMes } from '../venta-mes/venta-mes.entity';
import { Tthh } from './tthh.entity';
import { GetTthhFilterDto } from './dto/get-tthh-filter.dto';
import { CreateTthhPdfDto } from './dto/create-tthh-pdf.dto';
import { MailService } from '../mail/mail.service';
import { ObservacionDto } from './dto/observacion.dto';
import { UpdateTthhDto } from './dto/update-tthh.dto';
import { TthhPagosRepository } from '../tthh-pagos/tthh-pagos.repository';
import { TthhPagos } from '../tthh-pagos/tthh-pagos.entity';

@Injectable()
export class TthhService {
  constructor(
    private mailService: MailService,
    @InjectRepository(TthhRepository)
    private tthhRepository: TthhRepository,
    @InjectRepository(TthhPagosRepository)
    private tthhPagosRepository: TthhPagosRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(VentaMesRepository)
    private ventaMesRepository: VentaMesRepository,
  ) {}

  async getVentaMesAnioProveedorAlls(
    filterDto: GetTthhFilterDto,
  ): Promise<Tthh[]> {
    return this.tthhRepository.getTthhMesAnioTthhAlls(filterDto);
  }

  async getTthhMesAnioAlls(mes: Date, status: string) {
    try {
      const tthh = await this.tthhRepository
        .createQueryBuilder('tthh')
        .select(['aporte', 'total', 'totalProveedor', 'fechaPago', 'tthh.id'])
        .leftJoin('tthh.user', 'user')
        .addSelect('user.cedula', 'cedula')
        .addSelect('user.nombres', 'nombres')
        .addSelect('user.status', 'status')
        .where('tthh.fechaPago = :mes', { mes })
        .orderBy('user.nombres', 'ASC')
        .getRawMany();

      const tthhTotal = await this.tthhRepository
        .createQueryBuilder('tthh')
        .select('SUM(tthh.total)', 'suma')
        .where('tthh.fechaPago = :mes', { mes })
        .getRawMany();

      const tthhPago = await this.tthhPagosRepository
        .createQueryBuilder('tthhPago')
        .select([
          'tthhPago.total',
          'tthhPago.id',
          'tthhPago.status',
          'tthhPago.email',
        ])
        .leftJoin('tthhPago.tthh', 'tthh')
        .addSelect('tthh.total', 'total')
        .leftJoin('tthh.user', 'user')
        .addSelect('user.cedula', 'cedula')
        .addSelect('user.nombres', 'nombres')
        .addSelect('user.status', 'status')
        .where('tthhPago.mesDescontar = :mes', { mes })
        .orderBy('user.nombres', 'ASC')
        .getRawMany();

      const tthhPagoParcial = await this.tthhPagosRepository
        .createQueryBuilder('tthhPago')
        .select([
          'tthhPago.total',
          'tthhPago.id',
          'tthhPago.status',
          'tthhPago.email',
        ])
        .leftJoin('tthhPago.tthh', 'tthh')
        .addSelect('tthh.total', 'total')
        .leftJoin('tthh.user', 'user')
        .addSelect('user.cedula', 'cedula')
        .addSelect('user.nombres', 'nombres')
        .addSelect('user.status', 'status')
        .where('tthhPago.mesDescontar = :mes', { mes })
        .andWhere('tthh.status = "DIFERENCIA"')
        .getRawMany();

      const tthhPendiente = await this.tthhRepository
        .createQueryBuilder('tthh')
        .select(['aporte', 'total', 'totalProveedor', 'fechaPago', 'tthh.id'])
        .leftJoin('tthh.user', 'user')
        .addSelect('user.cedula', 'cedula')
        .addSelect('user.nombres', 'nombres')
        .addSelect('user.status', 'status')
        .where('tthh.fechaPago = :mes', { mes })
        .andWhere('tthh.status = "PENDIENTE"')
        .andWhere('tthh.total > 0')
        .orderBy('user.nombres', 'ASC')
        .getRawMany();

      const tthhPagoTotal = await this.tthhPagosRepository
        .createQueryBuilder('tthhPago')
        .select('SUM(tthhPago.total)', 'suma')
        .where('tthhPago.mesDescontar = :mes', { mes })
        .getRawMany();

      const ventaPendiente = await this.ventaMesRepository
        .createQueryBuilder('ventames')
        .select('ventames.userId', 'idDocente')
        .addSelect('ventames.mesDescontar', 'mes')
        .addSelect('SUM(valorCuota)', 'total')
        .leftJoin('ventames.user', 'user')
        .addSelect('user.cedula', 'cedula')
        .addSelect('user.nombres', 'nombres')
        .addSelect('user.status', 'status')
        .where('ventames.mesDescontar = :mes', { mes })
        .andWhere('ventames.status = :status', { status })
        .andWhere('ventames.valorCuota > 0')
        .groupBy('ventames.userId')
        .getRawMany();

      return {
        tthh,
        tthhTotal,
        tthhPago,
        tthhPagoParcial,
        tthhPendiente,
        tthhPagoTotal,
        ventaPendiente,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getTthhMesUserAlls(userId: number) {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const fechaAnterior = `${fechaActual.getFullYear()}-${mesActual - 1}-01`;

    const total: Tthh = await this.tthhRepository.findOne({
      where: { user: userId, fechaPago: fechaAnterior },
    });

    if (!total) {
      return {
        ok: false,
        total: 0,
      };
    }

    const dataTemp = {
      ok: true,
      total: total.total,
    };

    return dataTemp;
    // return this.tthhRepository.getTthhMesUserAlls(userId);
  }

  async getTthhId(tthhId: number) {
    const tthh = await this.tthhRepository
      .createQueryBuilder('tthh')
      .select([
        'aporte',
        'fechaPago',
        'tthh.id',
        'observacion',
        'tthh.status',
        'total',
        'totalProveedor',
      ])
      .leftJoin('tthh.user', 'user')
      .addSelect('user.cedula', 'cedula')
      .addSelect('user.nombres', 'nombres')
      .addSelect('user.status', 'status')
      .addSelect('user.id', 'userId')
      .where('tthh.id = :tthhId', { tthhId })
      .getRawOne();

    if (!tthh) {
      throw new ConflictException('No existe');
    }

    const venta: VentaMes[] = await this.ventaMesRepository
      .createQueryBuilder('venta')
      .select([
        'producto',
        'totalMeses',
        'cuotaMeses',
        'valorCuota',
        'venta.id',
      ])
      .leftJoin('venta.proveedor', 'proveedor')
      .addSelect('proveedor.nombre', 'proveedor')
      .leftJoin('venta.apuExtension', 'apuExtension')
      .addSelect('apuExtension.nombre', 'apuExtension')
      .where('venta.user = :userId', { userId: tthh.userId })
      .andWhere('venta.mesDescontar = :fechaPago', {
        fechaPago: tthh.fechaPago,
      })
      .getRawMany();

    return {
      tthh,
      sale: venta,
    };
  }

  async getTthhReportId(tthhId: number) {
    const tthhPagos: TthhPagos = await this.tthhPagosRepository.findOne({
      id: tthhId,
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

    return {
      tthhPagos,
      tthh,
      venta,
      diferencia: totalTthh - totalTthhPago,
    };
  }

  async createTthhCSV(file, fechaPago: Date, aporte: string): Promise<number> {
    let contador = 0;
    await Promise.all(
      file.map(async data => {
        const found: User = await this.userRepository.findOne({
          select: ['id', 'status'],
          where: {
            cedula: data.CEDULA,
          },
        });
        // Existe este usuario
        if (found) {
          // Obtenemos el total y mes de los docente que tiene deuda con los proveedores
          const venta = await this.totalProveedor(fechaPago, found.id);

          const ventaId = await this.ventaMesRepository
            .createQueryBuilder()
            .where('mesDescontar = :mes', { mes: fechaPago })
            .andWhere('userId = :id', { id: found.id })
            .getMany();

          if (ventaId) {
            ventaId.map(async item => {
              await this.ventaMesRepository.update(item.id, {
                status: 'PROCESO',
              });
            });
          }
          // Aqui tengo q actualizar

          if (venta) {
            if (found.status === 'ACTIVE') {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = aporte;
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = venta.total;
              // tthh.diferencia =
              //   this.cantidadDouble(data.TOTAL) -
              //   (parseFloat(aporte) + parseFloat(venta.total));
              // tthh.status = 'PENDIENTE';
              tthh.observacion = '';
              try {
                contador++;
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            } else {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = '0.0';
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = venta.total;
              // tthh.diferencia =
              //   this.cantidadDouble(data.TOTAL) - parseFloat(venta.total);

              // tthh.status = 'PENDIENTE';
              tthh.observacion = '';
              try {
                contador++;
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            }
          } else {
            if (found.status === 'ACTIVE') {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = aporte;
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = '0.0';
              // tthh.diferencia =
              //   this.cantidadDouble(data.TOTAL) - parseFloat(aporte);
              // tthh.status = 'PENDIENTE';
              tthh.observacion = '';
              try {
                contador++;
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            } else {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = '0.0';
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = '0.0';
              // tthh.mes = mes;
              // tthh.diferencia = this.cantidadDouble(data.TOTAL);
              // tthh.status = 'INACTIVE';
              tthh.observacion = '';
              try {
                contador++;
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            }
          }
        }
        // En caso que no exista no hace nada
      }),
    );

    return contador;
  }

  async updateStatusTthh(file): Promise<number> {
    await Promise.all(
      file.map(async data => {
        const found: User = await this.userRepository.findOne({
          select: ['id', 'status', 'email'],
          where: {
            cedula: data.user.cedula,
          },
        });
        if (found) {
          if (found.status === 'ACTIVE') {
            const reporte = await this.reporte(
              data.user.id,
              data.mes,
              data.anio,
            );

            const tthhFound = await this.tthhRepository.findOne({
              id: data.id,
            });

            const tthh = new Tthh();

            // if (!tthhFound.email) {
            //   tthh.email = true;
            //   // if (found.email) {
            //   //   this.mailService.sendMailReports(reporte);
            //   // }
            // }

            tthh.status = 'ACTIVE';

            try {
              this.tthhRepository.update(data.id, tthh);
            } catch (error) {
              throw new InternalServerErrorException('Error al actualizar.');
            }
          } else if (found.status === 'INACTIVE') {
            const tthh = new Tthh();
            tthh.status = 'INACTIVE';

            try {
              this.tthhRepository.update(data.id, tthh);
            } catch (error) {
              throw new InternalServerErrorException('Error al actualizar.');
            }
          }
        }
      }),
    );

    return 0;
  }

  async updateTthh(id: number, updateTthhDto: UpdateTthhDto) {
    const { aporte, total, observacion } = updateTthhDto;

    const tthh: Tthh = await this.tthhRepository.findOne({ id });
    if (!tthh) {
      throw new NotFoundException('No existe');
    }

    const newTthh = new Tthh();
    newTthh.aporte = aporte;
    newTthh.total = total;
    newTthh.observacion = observacion;

    try {
      await this.tthhRepository.update(id, newTthh);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar.');
    }
  }

  async createTthhCSVTest(file, fechaPago: Date, aporte: string) {
    const results = [];
    const anio = new Date().getFullYear();

    if (file) {
      fs.createReadStream(`./upload/csv/${file.filename}`)
        .on('error', () => {
          throw new InternalServerErrorException(
            'Error al Guardar el producto',
          );
        })
        .pipe(csv({ separator: ';' }))
        .on('data', data => {
          results.push(data);
        })
        .on('end', () => {
          results.forEach(async data => {
            const found: User = await this.userRepository.findOne({
              select: ['id', 'status'],
              where: {
                cedula: data.CEDULA,
              },
            });

            const venta = await this.ventaMesRepository
              .createQueryBuilder()
              .select('userId', 'Docente')
              .addSelect('mesPago', 'Mes')
              .addSelect('SUM(valorCuota)', 'total')
              .where('mesDescontar = :mes', { mes: fechaPago })
              .andWhere('userId = :userId', { userId: found.id })
              .addGroupBy('userId')
              .getRawOne();

            console.log(found);

            if (venta) {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = aporte;
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = venta.total;
              // tthh.diferencia =
              //   this.cantidadDouble(data.TOTAL) -
              //   (parseFloat(aporte) + parseFloat(venta.total));

              try {
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            } else {
              const tthh = new Tthh();
              tthh.user = found;
              tthh.fechaPago = fechaPago;
              tthh.aporte = aporte;
              tthh.total = this.cantidadDouble(data.TOTAL);
              tthh.totalProveedor = '0.0';
              // tthh.diferencia =
              //   this.cantidadDouble(data.TOTAL) - parseFloat(aporte);

              try {
                await tthh.save();
              } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el producto',
                );
              }
            }
          });
        });
      return true;
    }
    return false;
  }

  // async createTthhCSVTestAntiguo(file, mes: string, aporte: string) {
  //   const results = [];
  //   const dataResult = [];
  //   const anio = new Date().getFullYear();

  //   if (file) {
  //     fs.createReadStream(`./upload/csv/${file.filename}`)
  //       .on('error', () => {
  //         throw new InternalServerErrorException(
  //           'Error al Guardar el producto',
  //         );
  //       })
  //       .pipe(csv({ separator: ';' }))
  //       .on('data', data => {
  //         results.push(data);
  //       })
  //       .on('end', async () => {
  //         // results.map(async data => {
  //         //   const user = await this.userRepository.findOne({
  //         //     where: {
  //         //       cedula: data.CEDULA,
  //         //     },
  //         //   });

  //         //   if (!user) {
  //         //     console.log(data);
  //         //   }
  //         // });
  //         // -------->>>>>>>>>>
  //         results.forEach(async data => {
  //           const found: User = await this.userRepository.findOne({
  //             select: ['id', 'status'],
  //             where: {
  //               cedula: data.CEDULA,
  //             },
  //           });

  //           const proveedor =
  //             this.cantidadDouble(data.TOTAL) - parseFloat(aporte);

  //           const tthh = new Tthh();
  //           tthh.user = found;
  //           tthh.anio = anio;
  //           tthh.total = this.cantidadDouble(data.TOTAL);

  //           tthh.mes = mes;
  //           if (this.cantidadDouble(data.TOTAL) < parseFloat(aporte)) {
  //             // tthh.diferencia = 0;
  //             tthh.aporte = '0';
  //             tthh.totalProveedor = this.cantidadDouble(data.TOTAL);
  //           } else {
  //             tthh.totalProveedor = toString(proveedor);
  //             tthh.aporte = aporte;
  //             // tthh.diferencia =
  //             //   this.cantidadDouble(data.TOTAL) -
  //             //   (parseFloat(aporte) + proveedor);
  //           }

  //           try {
  //             await tthh.save();
  //           } catch (error) {
  //             console.log(error);
  //             throw new InternalServerErrorException(
  //               'Error al Guardar el producto',
  //             );
  //           }
  //         });
  //         // -------->>>>>>>>>>
  //       });
  //   }
  //   return dataResult;
  // }

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
          if (!data.TOTAL) {
            throw new NotFoundException(
              'El CSV no tiene los datos completos en el Total',
            );
          }

          // const like = data.NOMBRES.split(' ').join('%');
          const query = await this.userRepository.createQueryBuilder('user');
          query.where('user.cedula = :ci', {
            ci: data.CEDULA,
          });
          // query.andWhere('user.nombres like :name', { name: `${like}%` });
          const user = await query.getOne();

          if (!user) {
            dataTemp = { ...dataTemp, user: false };
            await results.push(dataTemp);
          }
        }),
      );
    }
    return results;
  }

  async createPdf(pfdDto: CreateTthhPdfDto) {
    const { userId, mes, anio } = pfdDto;

    const user: User = await this.userRepository.findOne({
      id: userId,
    });

    const venta: Tthh = await this.tthhRepository.findOne({
      where: {
        user: userId,
        fechaPago: mes,
      },
    });

    const ventaMes: VentaMes[] = await this.ventaMesRepository.find({
      user: user,
      mesPago: mes,
    });

    console.log(venta);

    // const total = Number(venta.totalProveedor) + Number(venta.aporte);

    // const fechaActual = moment().format('DD/MM/YYYY');

    // const data = {
    //   venta,
    //   ventaMes,
    //   total: total.toFixed(2),
    //   // diferencia: Number(venta.diferencia).toFixed(2),
    //   fecha: fechaActual,
    // };

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

    // try {
    //   const templateHtml = fs.readFileSync(
    //     path.join(process.cwd(), 'documents/index.hbs'),
    //     'utf8',
    //   );

    //   const template = handlebars.compile(templateHtml);
    //   const html = template(data);

    //   const pdfPath = `upload/reporte/${user.cedula}-${venta.fechaPago}.pdf`;

    //   const footer = `
    //   <div style="display: flex; width: 100%; justify-content: center; flex-direction: column;" >
    //     <div style="display: flex; flex-direction: column;">
    //       <div style=" justify-content: center; text-align: center;">
    //         <span style="display: inline-block;  font-size: 10px;">
    //           Web:
    //           <a href="http://aputransparencia.com/">www.aputransparencia.com</a>
    //         </span>
    //         <span style="display: inline-block; text-align: center; font-size: 10px; margin-left: 20px;">
    //           E-mail: <a href="mailto:info.apu@uleam.edu.ec">info.apu@uleam.edu.ec</a>
    //         </span>
    //       </div>
    //       <span style="font-size: 10px; text-align: center; margin-top: 5px">APU ULEAM © Copyright 2020, Todos los derechos reservados</span>
    //       <span style="font-size: 10px; text-align: center; margin-top: 3px">Manta - Manabí - Ecuador</span>
    //     </div>
    //       <span style="font-size: 10px; margin-left: 10px;">Fecha: ${fechaActual}</span>
    //   </div>
    //   `;

    //   const options = {
    //     format: 'A4',
    //     headerTemplate: '<p></p>',
    //     footerTemplate: footer,
    //     displayHeaderFooter: true,
    //     margin: {
    //       bottom: '100px',
    //     },
    //     printBackground: true,
    //     path: pdfPath,
    //   };

    //   const browser = await puppeteer.launch({
    //     args: ['--no-sandbox'],
    //     headless: true,
    //   });

    //   const page = await browser.newPage();

    //   // await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    //   //   waitUntil: 'networkidle0',
    //   // });

    //   await page.setContent(html);
    //   await page.pdf(options);
    //   await browser.close();
    // } catch (error) {
    //   console.log('Our Error', error);
    // }

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

  async deleteTthh(id): Promise<void> {
    try {
      const result = await this.tthhRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`No se a podido eliminar.`);
      }
    } catch (error) {
      throw new NotFoundException('Ocurrio un error al eliminar.');
    }
  }

  async deleteTthhAlls(allTthh: Tthh[]): Promise<number> {
    let contador = 0;
    await Promise.all(
      allTthh.map(async item => {
        try {
          const result = await this.tthhRepository.delete({ id: item.id });
          contador++;
          if (result.affected === 0) {
            throw new NotFoundException(`No se a podido eliminar.`);
          }
        } catch (error) {
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

  cantidadDouble(cantidad) {
    const cantidad1 = cantidad.replace('.', '');
    const cantidad2 = cantidad1.replace('.', '');
    const cantidad3 = cantidad2.replace(',', '.');
    return cantidad3;
  }

  // async compile(templateName, data) {
  //   const filePath = path.join(
  //     process.cwd(),
  //     'documents',
  //     `${templateName}.hbs`,
  //   );
  //   const html = await fse.readFile(filePath, 'utf-8');
  //   return hbs.compile(html)(data);
  // }

  async reporte(userId, mes, anio) {
    const user: User = await this.userRepository.findOne({
      id: userId,
    });

    const venta: Tthh = await this.tthhRepository.findOne({
      where: {
        user: userId,
        mes: mes,
        anio: anio,
      },
    });

    const ventaMes: VentaMes[] = await this.ventaMesRepository.find({
      user: user,
      mesPago: mes,
    });

    const total = Number(venta.totalProveedor) + Number(venta.aporte);

    const data = {
      venta,
      ventaMes,
      total: total.toFixed(2),
    };

    return data;
  }

  async totalProveedor(fechaPago, userId) {
    const venta = await this.ventaMesRepository
      .createQueryBuilder()
      .select('userId', 'Docente')
      .addSelect('mesDescontar', 'Mes')
      .addSelect('SUM(valorCuota)', 'total')
      .where('mesDescontar = :mes', { mes: fechaPago })
      .andWhere('userId = :userId', { userId })
      .addGroupBy('userId')
      .getRawOne();

    return venta;
  }

  async updateStatusVentaMes(fechaPago, id) {
    const ventaId = await this.ventaMesRepository
      .createQueryBuilder()
      .where('mesDescontar = :mes', { mes: fechaPago })
      .andWhere('userId = :id', { id })
      .getMany();

    if (ventaId) {
      ventaId.map(async item => {
        await this.ventaMesRepository.update(item.id, {
          status: 'PROCESO',
        });
      });
    }
  }

  async generarPagos(fechaPago: Date, aporte: string) {
    try {
      await this.tthhRepository.delete({ fechaPago: fechaPago });
    } catch (error) {
      throw new ConflictException(
        'No se puede generar los cobro de este mes. Probablemente este mes ya se le ha realizado el cobro.',
      );
    }

    const userActive: User[] = await this.userRepository.find();
    let contador = 0;
    let total = 0;
    const venta = [];
    await Promise.all(
      userActive.map(async item => {
        if (item.status === 'ACTIVE') {
          // Obtenemos la suma de los proveedores
          const ventaMes = await this.totalProveedor(fechaPago, item.id);
          // Modificamos el estado de la nómina
          await this.updateStatusVentaMes(fechaPago, item.id);
          // ==================================================================
          const ventaMesValid = ventaMes?.total || '0.0';
          const suma = parseFloat(ventaMesValid) + parseFloat(aporte);

          const tthh = new Tthh();
          tthh.aporte = aporte;
          tthh.fechaPago = fechaPago;
          tthh.user = item;
          tthh.totalProveedor = ventaMesValid;
          tthh.total = suma.toString();
          tthh.status = 'PENDIENTE';
          tthh.observacion = '';

          try {
            contador++;
            total = total + parseFloat(tthh.total);
            const userTemp = {
              status: tthh.user.status,
              cedula: tthh.user.cedula,
              nombres: tthh.user.nombres,
              aporte: parseFloat(tthh.aporte).toFixed(2),
              totalProveedor: parseFloat(tthh.totalProveedor).toFixed(2),
              total: parseFloat(tthh.total).toFixed(2),
            };
            venta.push(userTemp);
            await tthh.save();
          } catch (error) {
            throw new InternalServerErrorException(
              'Error al Guardar el producto',
            );
          }
        } else {
          // Obtenemos la suma de los proveedores
          const ventaMes = await this.totalProveedor(fechaPago, item.id);
          if (ventaMes !== undefined) {
            // Modificamos el estado de la nómina
            await this.updateStatusVentaMes(fechaPago, item.id);
            // ==================================================================
            const ventaMesValid = ventaMes?.total || '0.0';
            const suma = parseFloat(ventaMesValid);

            const tthh = new Tthh();
            tthh.aporte = '0.0';
            tthh.fechaPago = fechaPago;
            tthh.user = item;
            tthh.totalProveedor = ventaMesValid;
            tthh.total = suma.toString();
            tthh.status = 'PENDIENTE';
            tthh.observacion = '';

            try {
              contador++;
              total = total + parseFloat(tthh.total);
              const userTemp = {
                status: tthh.user.status,
                cedula: tthh.user.cedula,
                nombres: tthh.user.nombres,
                aporte: parseFloat(tthh.aporte).toFixed(2),
                totalProveedor: parseFloat(tthh.totalProveedor).toFixed(2),
                total: parseFloat(tthh.total).toFixed(2),
              };
              venta.push(userTemp);
              await tthh.save();
            } catch (error) {
              console.log(error);
              throw new InternalServerErrorException(
                'Error al Guardar el producto',
              );
            }
          }
        }
      }),
    );
    return { contador, venta, total };
  }

  async generarPagosOneUser(id: number, fechaPago: Date) {
    const userActive: User = await this.userRepository.findOne({
      id,
    });

    const ventaMes = await this.totalProveedor(fechaPago, id);

    if (userActive.status === 'INACTIVE') {
      const ventaId = await this.ventaMesRepository
        .createQueryBuilder()
        .where('mesDescontar = :mes', { mes: fechaPago })
        .andWhere('userId = :id', { id })
        .getMany();

      if (ventaId) {
        ventaId.map(async item => {
          await this.ventaMesRepository.update(item.id, {
            status: 'PROCESO',
          });
        });
      }

      const foundTthh: Tthh = await this.tthhRepository.findOne({
        user: userActive,
        fechaPago,
      });

      if (foundTthh) {
        console.log('aqui');
        const ventaMesValid = ventaMes?.total || '0.0';
        const suma = parseFloat(ventaMesValid) + 0;

        const tthh = new Tthh();
        tthh.aporte = '0.0';
        tthh.fechaPago = fechaPago;
        tthh.user = userActive;
        tthh.totalProveedor = ventaMesValid;
        tthh.total = suma.toFixed(2).toString();
        tthh.status = 'PENDIENTE';
        tthh.observacion = '';

        try {
          await this.tthhRepository.update(foundTthh.id, tthh);
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException(
            'Error al Guardar el producto',
          );
        }
      } else {
        const ventaMesValid = ventaMes?.total || '0.0';
        const suma = parseFloat(ventaMesValid) + 0;

        const tthh = new Tthh();
        tthh.aporte = '0.0';
        tthh.fechaPago = fechaPago;
        tthh.user = userActive;
        tthh.totalProveedor = ventaMesValid;
        tthh.total = suma.toString();
        tthh.status = 'PENDIENTE';
        tthh.observacion = '';

        try {
          await tthh.save();
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException(
            'Error al Guardar el producto',
          );
        }
      }
    }
  }

  async generarTthhPagos(file, fechaPago: Date): Promise<number> {
    // let contador = 0;
    await Promise.all(
      file.map(async data => {
        const found: Tthh = await this.tthhRepository.findOne({
          id: data.id,
        });
        console.log(fechaPago);
        await this.tthhRepository.update(data.id, {
          status: 'PAGADO',
          observacion: `El valor sera cobrado en su totalidad en el mes de ${moment(
            fechaPago,
          ).format('MMMM YYYY')}`,
        });

        const tthh: Tthh = new Tthh();
        tthh.observacion = `Se le suma el valor del mes de ${moment(
          data.fechaPago,
        ).format(
          'MMMM YYYY',
        )} por motivo que talento humano no realizo el descuento correspondiente al mes.`;
        tthh.fechaPago = fechaPago;
        tthh.user = data.user;
        tthh.total = data.total;
        tthh.aporte = '0';
        tthh.totalProveedor = '0';

        await tthh.save();
      }),
    );

    return 0;
  }
}
