import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PassUserDto } from './dto/pass-user.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { PassUserAdminDto } from './dto/pass-user-admin.dto';
import { multerOptions } from '../config/multer.config';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { Pagination } from 'src/paginate';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUserAlls(
    @Query(ValidationPipe) filterDto: GetUserFilterDto,
  ): Promise<User[]> {
    return this.userService.getUserAlls(filterDto);
  }

  // @Get('/paginate')
  // async index(@Req() request): Promise<Pagination<User>> {
  //   // TODO make PaginationOptionsInterface an object so it can be defaulted
  //   return await this.userService.paginate({
  //     keyword: request.query.hasOwnProperty('keyword')
  //       ? request.query.keyword
  //       : '',
  //     status: request.query.hasOwnProperty('status')
  //       ? request.query.status
  //       : null,
  //     rol: request.query.hasOwnProperty('rol') ? request.query.rol : null,
  //     limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
  //     page: request.query.hasOwnProperty('page') ? request.query.page : 0,
  //   });
  // }

  @Get('/paginate')
  async index(@Req() request): Promise<User[]> {
    // TODO make PaginationOptionsInterface an object so it can be defaulted
    const status = request.query.hasOwnProperty('status')
      ? request.query.status
      : null;
    return await this.userService.paginate(status);
  }

  @Get('/total')
  async userTotal() {
    return this.userService.getUserTotal();
  }

  @Get('/userId/:id')
  getUserById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const users = this.userService.getUserById(id, user);
    return users;
  }

  // --------------- CONSULTA TODOS EXCEL - CSV ---------------

  @Post('/generate/alls')
  generateUserCsv(@Res() res: Response) {
    return this.userService.generateUserAlls(res);
  }

  @Post('/generate/fecha/:fechaInicio/:fechaFin')
  generateUserFechaCsv(
    @Res() res: Response,
    @Param('fechaInicio') fechaInicio: Date,
    @Param('fechaFin') fechaFin: Date,
  ): Promise<User[]> {
    return this.userService.generateUserFechaAlls(res, fechaInicio, fechaFin);
  }

  @Post()
  @UsePipes(ValidationPipe)
  crearUsuario(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.createUser(createUserDto, user);
  }

  @Post('/csv')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  crearUsuarioCsv(@UploadedFile() file) {
    return this.userService.createUserCsvAlls(file);
  }

  @Post('/setRole/:userId/:roleId')
  updateRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updateRole(userId, user, roleId);
  }

  // @Post('/csv/inactive')
  // @UseInterceptors(FileInterceptor('file', multerOptions))
  // crearUsuarioCsvInactive(@UploadedFile() file) {
  //   return this.userService.createUserCsvAlls(file);
  // }

  @Delete('/:id/:status')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.deleteUser(id, status, user);
  }

  @Delete('/deleteRole/:userId/:roleId')
  deleteRol(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.deleteRole(userId, user, roleId);
  }

  @Patch('/:id/user')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updateUser(id, user, updateUserDto);
  }

  @Patch('/:id/details')
  updateUserDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updateUserDetails(id, user, updateUserDetailsDto);
  }

  @Patch('/:id/pass')
  @UsePipes(ValidationPipe)
  updatePass(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) passUserDto: PassUserDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updatePass(id, user, passUserDto);
  }

  @Patch('/:id/admin')
  @UsePipes(ValidationPipe)
  updatePassAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) passUserAdminDto: PassUserAdminDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updatePassAdmin(id, user, passUserAdminDto);
  }
}
