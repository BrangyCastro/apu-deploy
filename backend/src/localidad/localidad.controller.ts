import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { Localidad } from './localidad.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('localidad')
@UseGuards(AuthGuard())
export class LocalidadController {
  constructor(private localidadService: LocalidadService) {}

  @Get()
  getLocalidadAlls(): Promise<Localidad[]> {
    return this.localidadService.getLocalidadAlls();
  }

  @Get('/:id')
  getLocalidad(@Param('id', ParseIntPipe) id: number): Promise<Localidad> {
    return this.localidadService.getLocalidad(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createLocalidad(@Body(ValidationPipe) createLocalidad: CreateLocalidadDto) {
    return this.localidadService.createLocalidad(createLocalidad);
  }

  @Patch('/:id')
  updateLocalidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() createLocalidad: CreateLocalidadDto,
  ): Promise<Localidad> {
    return this.localidadService.updateLocalidad(id, createLocalidad);
  }

  @Delete('/:id')
  deleteLocalidad(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.localidadService.deleteLocalidad(id);
  }
}
