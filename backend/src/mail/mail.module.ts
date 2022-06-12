import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';

const mailConfig = config.get('mail');

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'aputransparencia.com',
          port: 465,
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: mailConfig.mailAccount,
            pass: mailConfig.mailAccountPassword,
          },
          connectionTimeout: 60000,
        },
        defaults: {
          from: '"APU Transparencia" <no-reply@aputransparencia.com>',
        },
        template: {
          dir: process.cwd() + '/documents/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
