import { ConflictException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import * as moment from 'moment';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { User } from '../user/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async sendMailExample(options: PaginationOptionsInterface) {
    let contador = options.page;
    const [results, total] = await this.userRepository.findAndCount({
      where: { status: 'ACTIVE' },
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });
    // console.log(results);
    results.map(data => {
      if (data.email) {
        console.log(
          `NO: ${contador++} Nombres: ${data.nombres} - Cedula: ${
            data.cedula
          } - Email: ${data.email}`,
        );
      }
    });
    // this.mailerService
    //   .sendMail({
    //     from: '"APU Transparencia" <no-reply@aputransparencia.com>',
    //     to: 'brangy.castro1@gmail.com',
    //     subject: 'BIENVENID@ A APU TRANSPARENCIA',
    //     template: 'mailWelcome',
    //     context: {
    //       name: 'BRANGY CASTRO VARA',
    //       ci: '1312729088',
    //     },
    //   })
    //   .then(success => {
    //     console.log(success);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     return err;
    //   });
  }

  async sendMailDocentes(options: PaginationOptionsInterface) {
    let contador = 0;
    const [results, total] = await this.userRepository.findAndCount({
      where: { status: 'ACTIVE' },
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });
    console.log(results);
    results.map(data => {
      if (data.email) {
        contador++;
        this.mailerService
          .sendMail({
            from: '"APU Transparencia" <no-reply@aputransparencia.com>',
            to: data.email,
            subject: 'BIENVENID@ A APU TRANSPARENCIA',
            template: './mailWelcome',
            context: {
              name: data.nombres,
              ci: data.cedula,
            },
          })
          .then(success => {
            console.log(success);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
    console.log(contador);
  }

  async sendMailNewDocentes(nombres: string, cedula: string, email: string) {
    this.mailerService
      .sendMail({
        from: '"APU Transparencia" <no-reply@aputransparencia.com>',
        to: email,
        // to: 'brangy.castro1@gmail.com',
        subject: 'BIENVENID@ A APU TRANSPARENCIA',
        template: './mailWelcome',
        context: {
          name: nombres,
          ci: cedula,
        },
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async sendMailNewPromo(proveedor: string, fecha: string) {
    this.mailerService
      .sendMail({
        from: '"APU Transparencia" <no-reply@aputransparencia.com>',
        to: 'info.apu@uleam.edu.ec',
        // to: 'brangy.castro1@gmail.com',
        subject: 'APU TRANSPARENCIA NOTIFICACIÓN',
        template: './mailNotiNewPromo',
        context: {
          proveedor,
          fecha,
        },
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async sendMailReports(reporte) {
    try {
      const success = await this.mailerService.sendMail({
        from: '"APU Transparencia" <no-reply@aputransparencia.com>',
        to: reporte.user.email,
        // to: 'brangy.castro1@gmail.com',
        subject: 'Reporte mensual',
        template: './mailReports',
        context: {
          tthhPagos: reporte.tthhPagos,
          tthh: reporte.tthh,
          venta: reporte.venta,
          diferencia: reporte.diferencia,
          mes: `${moment(reporte.tthhPagos.mesDescontar)
            .format('MMMM YYYY')
            .toUpperCase()}`,
        },
      });
      return success;
    } catch (error) {
      throw new ConflictException(
        'Ha ocurrido un error al enviar el correo electrónico.',
      );
    }
  }

  async sendMailExampleAlls() {
    this.mailerService
      .sendMail({
        from: '"APU Transparencia" <no-reply@aputransparencia.com>',
        to: 'brangy.castro1@gmail.com',
        subject: 'APU TRANSPARENCIA ¡Desde hoy, ya es una realidad!',
        template: './mailWelcomeAlls',
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  async sendMailDocentesAlls(options: PaginationOptionsInterface) {
    const [results, total] = await this.userRepository.findAndCount({
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });
    let contador = 0;
    results.map(data => {
      if (data.email) {
        contador++;
        this.mailerService
          .sendMail({
            from: '"APU Transparencia" <no-reply@aputransparencia.com>',
            to: data.email,
            subject: 'APU TRANSPARENCIA ¡Desde hoy, ya es una realidad!',
            template: './mailWelcomeAlls',
          })
          .then(success => {
            console.log(success);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });

    console.log(contador);

    // let contadorError = 0;
    // const email = [];
    // found.map(data => {
    //   if (data.email) {
    //     email.push(data.email);
    //   }
    // });
    // console.log(results);
    // this.mailerService
    //   .sendMail({
    //     from: '"APU Transparencia" <no-reply@aputransparencia.com>',
    //     to: email,
    //     subject: 'APU TRANSPARENCIA ¡Desde hoy, ya es una realidad!',
    //     template: 'mailWelcomeAlls',
    //   })
    //   .then(success => {
    //     console.log(success);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // console.log(contador);
    // console.log(contadorError);
  }

  async sendMailManual() {
    // const results = [];
    // fs.createReadStream('./upload/csv/Nuevos Usuarios.csv')
    //   .pipe(csv({ separator: ';' }))
    //   .on('data', data => results.push(data))
    //   .on('end', () => {
    //     results.map(async data => {
    //       const user: User = await this.userRepository.findOne({
    //         where: { cedula: data.CEDULA },
    //       });
    //       if (user.email) {
    //         this.mailerService
    //           .sendMail({
    //             from: '"APU Transparencia" <no-reply@aputransparencia.com>',
    //             to: user.email,
    //             subject: 'BIENVENID@ A APU TRANSPARENCIA',
    //             template: 'mailWelcome',
    //             context: {
    //               name: user.nombres,
    //               ci: user.cedula,
    //             },
    //           })
    //           .then(success => {
    //             console.log(success);
    //           })
    //           .catch(err => {
    //             console.log(err);
    //             return err;
    //           });
    //       } else {
    //         console.log(`Nombres: ${user.nombres} - Cedula: ${user.cedula}`);
    //       }
    //     });
    //   });
  }
}

// <IfModule mod_rewrite.c>

// #write the following rule
// RewriteEngine On
// RewriteRule ^$ http://127.0.0.1:8000/ [P,L]
// RewriteCond %{REQUEST_FILENAME} !-f
// RewriteCond %{REQUEST_FILENAME} !-d
// RewriteRule ^(.*)$ http://127.0.0.1:8000/$1 [P,L]

// </IfModule>

// <IfModule mod_rewrite.c>

// RewriteEngine On
// RewriteBase /
// RewriteRule ^index\.html$ - [L]
// RewriteCond %{REQUEST_FILENAME} !-f
// RewriteCond %{REQUEST_FILENAME} !-d
// RewriteCond %{REQUEST_FILENAME} !-l
// #RewriteCond %{SERVER_PORT} 80
// #RewriteRule ^(.*)$ https://aputransparencia.com/$1 [R=301,L]
// RewriteRule . /index.html [L]

// #RewriteRule (./backend/*) http://localhost:3000/$1 [P,L]

// </IfModule>

export interface PaginationOptionsInterface {
  limit: number;
  page: number;
}
