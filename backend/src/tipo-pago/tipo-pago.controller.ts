import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTipoPagoDto } from './dto/create.dto';
import { TipoPago } from './tipo-pago.entity';
import { TipoPagoService } from './tipo-pago.service';

@Controller('tipo-pago')
@UseGuards(AuthGuard())
export class TipoPagoController {
  constructor(private tipoPagoService: TipoPagoService) {}

  @Get()
  getAlls(): Promise<TipoPago[]> {
    return this.tipoPagoService.getRolAlls();
  }

  @Post()
  async create(
    @Body(ValidationPipe) createTipoPagoDto: CreateTipoPagoDto,
  ): Promise<boolean> {
    return this.tipoPagoService.create(createTipoPagoDto);
  }
}
