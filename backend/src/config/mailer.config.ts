import { Injectable } from '@nestjs/common';
import { MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as config from 'config';

const mailConfig = config.get('mail');

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  createMailerOptions() {
    return {
      transport: {
        host: 'aputransparencia.com',
        port: 465,
        secure: true,
        auth: {
          user: mailConfig.mailAccount,
          pass: mailConfig.mailAccountPassword,
        },
      },
      defaults: {
        from: '"APU Transparencia" <no-reply@aputransparencia.com>',
      },
      template: {
        dir: process.cwd() + '/documents/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
