import {
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetProveedorFilterDto } from './dto/get-proveedor-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editProveedorFileName,
  imageFileFilter,
} from '../config/multer.config';
import { ParseIntPipe } from '../pipe/parse-int.pipe';

@Controller('proveedor')
export class ProveedorController {
  constructor(private proveedorServices: ProveedorService) {}

  @Get()
  @UseGuards(AuthGuard())
  getProveedorAlls(
    @Query(ValidationPipe) filterDto: GetProveedorFilterDto,
  ): Promise<Proveedor[]> {
    return this.proveedorServices.getProveedorAlls(filterDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getProveedorById(@Param('id', ParseIntPipe) id: number): Promise<Proveedor> {
    return this.proveedorServices.getProveedorById(id);
  }

  @Get('/prove/:id/:userId')
  @UseGuards(AuthGuard())
  getProveedorAndUserById(
    @Param('id', new ParseIntPipe())
    id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Proveedor> {
    return this.proveedorServices.getProveedorAndUserById(id, userId);
  }

  @Get('publico/:proveedor')
  seeUploadedFile(@Param('proveedor') image, @Res() res) {
    return res.sendFile(image, { root: './upload/proveedor' });
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  crearProveedor(
    @Body(ValidationPipe) createProveedorDto: CreateProveedorDto,
  ): Promise<void> {
    return this.proveedorServices.createProveedor(createProveedorDto);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './upload/proveedor',
        filename: editProveedorFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() img, @Param('id') id) {
    return this.proveedorServices.updateImgProveedor(id, img.filename);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  updateProveedor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ): Promise<void> {
    return this.proveedorServices.updateProveedor(id, updateProveedorDto);
  }

  @Delete('/:id/:status')
  @UseGuards(AuthGuard())
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ) {
    return this.proveedorServices.deleteProveedor(id, status);
  }
}
