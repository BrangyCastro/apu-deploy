import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
  Get,
  ValidationPipe,
  UsePipes,
  Body,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VentaMesService } from './venta-mes.service';
import { VentaMes } from './venta-mes.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { GetVentasFilterDto } from './dto/get-ventas-filter.dto';
import { GetVentasCustomDto } from './dto/get-ventas-custom.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/user/decorators/get-user.decorator';

@Controller('venta-mes')
@UseGuards(AuthGuard())
export class VentaMesController {
  constructor(private ventaMesServices: VentaMesService) {}

  @Get()
  getVentaMesAnioProveedorAlls(
    @Query(ValidationPipe) filterDto: GetVentasFilterDto,
  ): Promise<VentaMes[] | { VentaMes: VentaMes[]; total } | VentaMes> {
    return this.ventaMesServices.getVentaMesAnioProveedorAlls(filterDto);
  }

  @Get('/custom/query/count')
  getVentaCustomAlls(
    @Query(ValidationPipe) filterDto: GetVentasCustomDto,
  ): Promise<VentaMes[]> {
    return this.ventaMesServices.getVentaCustomAlls(filterDto);
  }

  @Get('/:mes/:userId/docente')
  getVentaMesUserAlls(
    @Param('mes') mes: Date,
    @Param('userId') userId: string,
  ): Promise<VentaMes[]> {
    return this.ventaMesServices.getVentaMesUserAlls(mes, userId);
  }

  @Get('/:mes/:anio')
  getVentaMesAnioAlls(@Param('mes') mes: Date): Promise<VentaMes[]> {
    return this.ventaMesServices.getVentaMesAnioAlls(mes);
  }

  @Post('/csv/:id/:mes')
  crearVentaCsv(
    @Body() allVentas: VentaMes[],
    @Param('id', ParseIntPipe) id: number,
    @Param('mes') mes: Date,
  ): Promise<number> {
    return this.ventaMesServices.createVentaCSV(allVentas, id, mes);
  }

  @Post('/apu/:id/:mes')
  crearVentaCsvApu(
    @Body() allVentas: VentaMes[],
    @Param('id', ParseIntPipe) id: number,
    @Param('mes') mes: Date,
  ): Promise<number> {
    return this.ventaMesServices.createVentaApuCSV(allVentas, id, mes);
  }

  @Post()
  @UsePipes(ValidationPipe)
  crearVenta(@Body(ValidationPipe) createVentaDto: CreateVentaDto) {
    return this.ventaMesServices.createVentaSingle(createVentaDto);
  }

  @Post('/review')
  crearVentaReview(@Body() allVentas: VentaMes[]): Promise<any[]> {
    return this.ventaMesServices.createVentaReview(allVentas);
  }

  @Patch('/:id')
  updateVenta(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateVentaDto: UpdateVentaDto,
    @GetUser() user: User,
  ) {
    return this.ventaMesServices.updateVenta(id, updateVentaDto, user);
  }
}
