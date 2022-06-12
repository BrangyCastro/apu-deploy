import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateApuDto } from './dto/create-apu.dto';
import { ApuExtension } from './apuextension.entity';
import { ApuextensionService } from './apuextension.service';
import { AuthGuard } from '@nestjs/passport';
import { GetExtensionFilterDto } from './dto/get-extension-filter.dto';

@Controller('apuextension')
@UseGuards(AuthGuard())
export class ApuextensionController {
  constructor(private apuService: ApuextensionService) {}

  @Get(':id')
  getProveedorId(@Param('id', ParseIntPipe) id: number): Promise<ApuExtension> {
    return this.apuService.getApuId(id);
  }

  @Get()
  getProveedorAlls(
    @Query(ValidationPipe) filterDto: GetExtensionFilterDto,
  ): Promise<ApuExtension[]> {
    return this.apuService.getApuAlls(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createApu(
    @Body(ValidationPipe) createApuDto: CreateApuDto,
  ): Promise<ApuExtension> {
    return this.apuService.createApu(createApuDto);
  }

  @Patch('/:id')
  updateApu(
    @Param('id', ParseIntPipe) id: number,
    @Body() createApuDto: CreateApuDto,
  ): Promise<void> {
    return this.apuService.updateApu(id, createApuDto);
  }

  @Delete('/:id/:status')
  deleteLocalidad(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ): Promise<void> {
    return this.apuService.deleteApu(id, status);
  }
}
