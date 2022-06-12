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
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { InformeService } from './informe.service';
import { Informe } from './informe.entity';
import { CreateInformeDto } from './dto/create-informe.dto';
import { editPdfFileName, pdfFileFilter } from '../config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('informe')
export class InformeController {
  constructor(private informeService: InformeService) {}

  @Get('/publico')
  getLocalidadPublico(): Promise<Informe[]> {
    return this.informeService.getInformePublico();
  }

  @Get('publico/:pdfpath')
  seeUploadedFile(@Param('pdfpath') image, @Res() res) {
    return res.sendFile(image, { root: './upload/informe/gestion' });
  }

  @Get()
  getInformeAlls(): Promise<Informe[]> {
    return this.informeService.getInformeAlls();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createInforme(
    @Body(ValidationPipe) createInformeDto: CreateInformeDto,
  ): Promise<Informe> {
    return this.informeService.createInforme(createInformeDto);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: './upload/informe/gestion',
        filename: editPdfFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Param('id') id) {
    return this.informeService.updatePdfInforme(id, file.filename);
  }

  @Patch('/:id')
  updateLocalidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() createInformeDto: CreateInformeDto,
  ): Promise<void> {
    return this.informeService.updateInforme(id, createInformeDto);
  }

  @Delete('/:id')
  deletePresupuesto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.informeService.deleteInforme(id);
  }
}
