import { GetUser } from './../user/decorators/get-user.decorator';
import { User } from './../user/user.entity';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
  Patch,
  ParseIntPipe,
  Delete,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../config/multer.config';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoService } from './promo.service';
import { Promo } from './promo.entity';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('promo')
export class PromoController {
  constructor(private promoService: PromoService) {}

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './upload/promo' });
  }

  @Get()
  getPromo(@Query(ValidationPipe) filterDto: GetPromoFilterDto) {
    return this.promoService.getPromoById(filterDto);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard())
  getPromoAndUserById(
    @Param('id', new ParseIntPipe())
    id: number,
    @GetUser() user: User,
  ): Promise<Promo> {
    return this.promoService.getPromoAndUserById(id, user);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './upload/promo',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Param('id') id) {
    // const response = {
    //   originalname: file.originalname,
    //   filename: file.filename,
    // };
    // return response;
    return this.promoService.updatePhoto(id, file.filename);
  }

  @Post('new/post')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async createPromo(
    @Body(ValidationPipe) createPromoDto: CreatePromoDto,
    @GetUser() user: User,
  ): Promise<Promo> {
    return this.promoService.createPromo(createPromoDto, user);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updatePromo(
    @Body(ValidationPipe) createPromoDto: CreatePromoDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.promoService.updatePromo(id, createPromoDto);
  }

  @Delete('/:id/:status')
  @UseGuards(AuthGuard())
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', ParseBoolPipe) status: boolean,
    @GetUser() user: User,
  ) {
    return this.promoService.deletePromo(id, status, user);
  }
}
