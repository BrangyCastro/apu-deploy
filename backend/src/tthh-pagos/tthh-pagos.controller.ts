import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Query,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { TthhPagos } from './tthh-pagos.entity';
import { TthhPagosService } from './tthh-pagos.service';
import { UpdateDto } from './dto/update.dto';
import { CreateTthhPdfDto } from 'src/tthh/dto/create-tthh-pdf.dto';

@Controller('tthh-pagos')
export class TthhPagosController {
  constructor(private tthhPagosService: TthhPagosService) {}

  @Get('/fecha/:mes')
  getTthhMesAnioAlls(@Param('mes') mes: Date) {
    return this.tthhPagosService.getTthhPagosAlls(mes);
  }

  @Get('/details/:id')
  getTthhPagosId(@Param('id') id: number) {
    return this.tthhPagosService.getTthhPagosId(id);
  }

  @Get('/fecha/:mesInicio/:mesFin/:id')
  getTthhPagosUserMes(
    @Param('mesInicio') mesInicio: Date,
    @Param('mesFin') mesFin: Date,
    @Param('id') id: string,
  ): Promise<TthhPagos[]> {
    return this.tthhPagosService.getTthhPagosUserMes(mesInicio, mesFin, id);
  }

  @Get('/report/:mesInicio/:mesFin/:id')
  getTthhPagosUserMesReporte(
    @Param('mesInicio') mesInicio: Date,
    @Param('mesFin') mesFin: Date,
    @Param('id') id: number,
  ) {
    return this.tthhPagosService.getTthhPagosUserMesReporte(
      mesInicio,
      mesFin,
      id,
    );
  }

  @Post()
  createTthhPagoCSV(@Body() allTthh: TthhPagos[]): Promise<number> {
    return this.tthhPagosService.createTthhPagoCSV(allTthh);
  }

  @Post('/review')
  crearVentaReview(@Body() allVentas: TthhPagos[]): Promise<any[]> {
    return this.tthhPagosService.createTthhReview(allVentas);
  }

  @Post('/create/pdf')
  crearUsuarioPdf(@Query(ValidationPipe) pfdDto: CreateTthhPdfDto) {
    return this.tthhPagosService.createPdf(pfdDto);
  }

  @Post('/email/:id')
  sendEmailReport(@Param('id') id: number) {
    return this.tthhPagosService.sendEmailReport(id);
  }

  @Post('/email')
  sendEmailReportAlls(@Body() data: TthhPagos[]) {
    return this.tthhPagosService.sendEmailReportAlls(data);
  }

  @Patch()
  updateStatusTthhPagos(@Body() updateStatus: TthhPagos[]): Promise<number> {
    return this.tthhPagosService.updateStatusTthhPagos(updateStatus);
  }

  @Patch('/:id')
  updateTthhPagos(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
  ): Promise<void> {
    return this.tthhPagosService.updateTthhPagos(id, updateDto);
  }

  @Delete()
  deleteTthhAlls(@Body() allTthh: TthhPagos[]): Promise<number> {
    return this.tthhPagosService.deleteTthhPagosAlls(allTthh);
  }

  @Delete('/:id')
  deleteTthhPagosId(@Param('id') id: number): Promise<void> {
    return this.tthhPagosService.deleteTthhPagosId(id);
  }
}
