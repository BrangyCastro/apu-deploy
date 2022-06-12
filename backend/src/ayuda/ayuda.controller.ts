import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AyudaService } from './ayuda.service';
import { CreateAyudaDto } from './dto/create-ayuda.dto';
import { Ayuda } from './ayuda.entity';
import { Pagination } from 'src/paginate';

@Controller('ayuda')
export class AyudaController {
  constructor(private ayudaService: AyudaService) {}

  @Get()
  async getAyudaPagination(@Req() request): Promise<Pagination<Ayuda>> {
    return await this.ayudaService.getAyudaPagination({
      keyword: request.query.hasOwnProperty('keyword')
        ? request.query.keyword
        : '',
      status: request.query.hasOwnProperty('status')
        ? request.query.status
        : null,
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Get('/:id')
  updateApu(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.ayudaService.getAyudaId(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createApu(
    @Body(ValidationPipe) createAyudaDto: CreateAyudaDto,
  ): Promise<Ayuda> {
    return this.ayudaService.createAyuda(createAyudaDto);
  }
}
