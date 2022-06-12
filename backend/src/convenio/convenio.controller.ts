import { diskStorage } from 'multer';
import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  ParseIntPipe,
  Res,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvenioService } from './convenio.service';
import { Convenio } from './convenio.entity';
import { CreateConvenioDto } from './dto/create-covenio.dto';
import { editPdfFileName, pdfFileFilter } from '../config/multer.config';
import { UpdateConvenioDto } from './dto/update-convenio.dto';

@Controller('convenio')
export class ConvenioController {
  constructor(private convenioService: ConvenioService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPromo(
    @Body(ValidationPipe) createConvenioDto: CreateConvenioDto,
  ): Promise<Convenio> {
    return this.convenioService.createConvenio(createConvenioDto);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: './upload/convenios',
        filename: editPdfFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Param('id') id) {
    return this.convenioService.updatePdfConvenio(id, file.filename);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<Convenio> {
    const users = this.convenioService.getConvenioIdProveedor(id);
    return users;
  }

  @Get('/alls/:id')
  getConvenioAlls(@Param('id', ParseIntPipe) id: number): Promise<Convenio[]> {
    return this.convenioService.getConvenioAllsIdProveedor(id);
  }

  @Get('/pdf/:pdfpath')
  seeUploadedFile(@Param('pdfpath') image, @Res() res) {
    return res.sendFile(image, { root: './upload/convenios' });
  }

  @Delete(':id')
  getConvenioDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.convenioService.deleteConvenio(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateConvenioDto,
  ): Promise<void> {
    return this.convenioService.updateConvenio(id, updateUserDto);
  }
}
