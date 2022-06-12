import {
  Controller,
  Post,
  Request,
  Param,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private serviceMail: MailService) {}

  @Post('/prueba/docente')
  sendMailExample(@Request() request) {
    return this.serviceMail.sendMailExample({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 50,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Post('/prueba/docente/alls')
  sendMailExampleAlls() {
    return this.serviceMail.sendMailExampleAlls();
  }

  @Post('/docente')
  sendMailDoncente(@Request() request) {
    this.serviceMail.sendMailDocentes({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 50,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Post('/docente/alls')
  sendMailDoncenteAlls(@Request() request) {
    this.serviceMail.sendMailDocentesAlls({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 50,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Post('/docente/new/:nombres/:cedula/:email')
  sendMailNewDoncente(
    @Param('nombres') nombres: string,
    @Param('cedula') cedula: string,
    @Param('email') email: string,
  ) {
    this.serviceMail.sendMailNewDocentes(nombres, cedula, email);
  }

  // @Post('/docente/new/:proveedor/:fecha/')
  // sendMailNewDoncente(
  //   @Param('proveedor') proveedor: string,
  //   @Param('fecha') fecha: string,
  // ) {
  //   this.serviceMail.sendMailNewPromo(proveedor, fecha);
  // }

  // @Post()
  // sendMailManual() {
  //   return this.serviceMail.sendMailManual();
  // }

  // @Post('/reports')
  // sendMailReports() {
  //   this.serviceMail.sendMailReports(
  //     'JULIO',
  //     'brangy.castro1@gmail.com',
  //     '20.00',
  //     'N/D',
  //   );
  // }
}
