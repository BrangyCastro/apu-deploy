import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { Facultad } from './facultad.entity';
import { FacultadService } from './facultad.service';

@Controller('facultad')
@UseGuards(AuthGuard())
export class FacultadController {
  constructor(private facultadService: FacultadService) {}

  @Get()
  getLocalidadAlls(): Promise<Facultad[]> {
    return this.facultadService.getFacultadAlls();
  }

  @Post()
  createFacultad(@Body() createFacultadDto: CreateFacultadDto): Promise<void> {
    return this.facultadService.createFacultad(createFacultadDto);
  }

  @Patch('/:id')
  updateLocalidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() createFacultadDto: CreateFacultadDto,
  ): Promise<void> {
    return this.facultadService.updateLocalidad(id, createFacultadDto);
  }

  @Delete('/:id')
  deleteLocalidad(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.facultadService.deleteLocalidad(id);
  }
}
