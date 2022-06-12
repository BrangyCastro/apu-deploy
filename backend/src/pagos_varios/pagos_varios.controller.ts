import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'src/paginate';
import { CreateMortuoriaDto } from './dto/create-mortuoria.dto';
import { PagosVarios } from './pagos_varios.entity';
import { PagosVariosService } from './pagos_varios.service';

@Controller('pagos-varios')
@UseGuards(AuthGuard())
export class PagosVariosController {
  constructor(private pagosVariosService: PagosVariosService) {}

  @Get()
  async index(@Req() request): Promise<Pagination<PagosVarios>> {
    // TODO make PaginationOptionsInterface an object so it can be defaulted
    return await this.pagosVariosService.getPaginateMortuotia({
      keyword: request.query.hasOwnProperty('keyword')
        ? request.query.keyword
        : '',
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Get('/:start/:end')
  async getDate(
    @Param('start') start: Date,
    @Param('end') end: Date,
  ): Promise<PagosVarios[]> {
    return this.pagosVariosService.getDate(start, end);
  }

  @Post()
  async createMortuoria(
    @Body(ValidationPipe) createMortuotiaDto: CreateMortuoriaDto,
    @Query() afiliado: boolean,
  ): Promise<void> {
    return this.pagosVariosService.createPagosVariosMortuoria(
      createMortuotiaDto,
      afiliado,
    );
  }

  @Get('/generate/alls/data')
  generateUserCsv() {
    return this.pagosVariosService.generateMortuoriaAlls();
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updatePromo(
    @Body(ValidationPipe) createMortuotiaDto: CreateMortuoriaDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.pagosVariosService.updateMortuoria(id, createMortuotiaDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.pagosVariosService.deleteMortuoria(id);
  }
}
