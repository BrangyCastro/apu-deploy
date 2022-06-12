import {
  Controller,
  Post,
  Get,
  Param,
  ValidationPipe,
  Query,
  UseGuards,
  Header,
  Res,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TthhService } from './tthh.service';
import { Tthh } from './tthh.entity';
import { GetTthhFilterDto } from './dto/get-tthh-filter.dto';
import { CreateTthhPdfDto } from './dto/create-tthh-pdf.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as fs from 'fs';
import { UpdateTthhDto } from './dto/update-tthh.dto';

@Controller('tthh')
@UseGuards(AuthGuard())
export class TthhController {
  constructor(private tthhService: TthhService) {}

  @Get()
  getVentaMesAnioTthhAlls(
    @Query(ValidationPipe) filterDto: GetTthhFilterDto,
  ): Promise<Tthh[]> {
    return this.tthhService.getVentaMesAnioProveedorAlls(filterDto);
  }

  @Get('/fecha/:mes/:status')
  getTthhMesAnioAlls(@Param('mes') mes: Date, @Param('status') status: string) {
    return this.tthhService.getTthhMesAnioAlls(mes, status);
  }

  @Get('/:userId')
  getTthhMesUserAlls(@Param('userId') userId: number) {
    return this.tthhService.getTthhMesUserAlls(userId);
  }

  @Get('/todos/nomina/:tthhId')
  getTthhId(@Param('tthhId') tthhId: number) {
    return this.tthhService.getTthhId(tthhId);
  }

  @Get('/todos/report/:tthhId')
  getTthhReportId(@Param('tthhId') tthhId: number) {
    return this.tthhService.getTthhReportId(tthhId);
  }

  @Get('download/pdf/user/:cedula/:mes')
  @Header('Content-Type', 'application/pdf')
  getPdf(
    @Res() res: Response,
    @Param('mes') mes: string,
    @Param('cedula') cedula: string,
  ) {
    res.setHeader('Content-Type', 'application/pdf');
    res.attachment(`${cedula}-${mes}.pdf`);
    const path = `./upload/reporte/${cedula}-${mes}.pdf`;
    const stream = fs.createReadStream(path);
    stream.pipe(res).once('close', function() {
      stream.destroy();
      fs.unlinkSync(path);
    });
  }

  @Post('/csv/:mes/:aporte')
  crearUsuarioCsv(
    @Body() allTthh: Tthh[],
    @Param('mes') mes: Date,
    @Param('aporte') aporte: string,
  ): Promise<number> {
    return this.tthhService.createTthhCSV(allTthh, mes, aporte);
  }

  @Post('/create-pdf')
  crearUsuarioPdf(@Query(ValidationPipe) pfdDto: CreateTthhPdfDto) {
    return this.tthhService.createPdf(pfdDto);
  }

  @Post('/review')
  crearVentaReview(@Body() allVentas: Tthh[]): Promise<any[]> {
    return this.tthhService.createTthhReview(allVentas);
  }

  @Post('/generar/:mesPago/:aporte')
  generarPagos(
    @Param('mesPago') mesPago: Date,
    @Param('aporte') aporte: string,
  ): Promise<{ contador; venta; total }> {
    return this.tthhService.generarPagos(mesPago, aporte);
  }

  @Post('/one/:id/:mesPago')
  generarPagosOneUser(
    @Param('id') id: number,
    @Param('mesPago') mesPago: Date,
  ) {
    return this.tthhService.generarPagosOneUser(id, mesPago);
  }

  @Post('/alls/:mesPago')
  generarTthhPagos(
    @Body() allTthh: Tthh[],
    @Param('mesPago') mesPago: Date,
  ): Promise<number> {
    return this.tthhService.generarTthhPagos(allTthh, mesPago);
  }

  @Patch()
  updateLocalidad(@Body() updateStatus: Tthh[]): Promise<number> {
    return this.tthhService.updateStatusTthh(updateStatus);
  }

  @Patch('/:id')
  updateTthh(@Param('id') id: number, @Body() updateTthhDto: UpdateTthhDto) {
    return this.tthhService.updateTthh(id, updateTthhDto);
  }

  @Delete('/:id')
  deleteTthh(@Param('id') id: number): Promise<void> {
    return this.tthhService.deleteTthh(id);
  }

  @Delete()
  deleteTthhAlls(@Body() allTthh: Tthh[]): Promise<number> {
    return this.tthhService.deleteTthhAlls(allTthh);
  }
}
