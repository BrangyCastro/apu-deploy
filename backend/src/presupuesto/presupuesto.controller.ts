import { diskStorage } from 'multer';
import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseInterceptors,
  UploadedFile,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { Presupuesto } from './presupuesto.entity';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editPdfFileName, pdfFileFilter } from '../config/multer.config';
import { AuthGuard } from '@nestjs/passport';

@Controller('presupuesto')
export class PresupuestoController {
  constructor(private presupuestoService: PresupuestoService) {}

  @Get('/publico')
  @UseGuards(AuthGuard())
  getPresupuestoPublico(): Promise<Presupuesto[]> {
    return this.presupuestoService.getPresupuestoPublico();
  }

  @Get()
  @UseGuards(AuthGuard())
  getPresupuestoAlls(): Promise<Presupuesto[]> {
    return this.presupuestoService.getPresupuestoAlls();
  }

  @Get('publico/:pdfpath')
  seeUploadedFile(@Param('pdfpath') image, @Res() res) {
    return res.sendFile(image, { root: './upload/informe/presupuesto' });
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async createPresupuesto(
    @Body(ValidationPipe) createPresupuestoDto: CreatePresupuestoDto,
  ): Promise<Presupuesto> {
    return this.presupuestoService.createPresupuesto(createPresupuestoDto);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: './upload/informe/presupuesto',
        filename: editPdfFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Param('id') id) {
    return this.presupuestoService.updatePdfPresupuesto(id, file.filename);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  updateLocalidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPresupuestoDto: CreatePresupuestoDto,
  ): Promise<void> {
    return this.presupuestoService.updatePresupuesto(id, createPresupuestoDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deletePresupuesto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.presupuestoService.deletePresupuesto(id);
  }
}
