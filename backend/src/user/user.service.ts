import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PassUserDto } from './dto/pass-user.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { RolesRepository } from '../roles/roles.repository';
import { PassUserAdminDto } from './dto/pass-user-admin.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { PaginationOptionsInterface, Pagination } from '../paginate';
import { HistorialService } from 'src/historial/historial.service';
import { FacultadRepository } from 'src/facultad/facultad.repository';
import * as bcrypt from 'bcryptjs';
import { Between } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RolesRepository)
    private roleRepository: RolesRepository,
    @InjectRepository(FacultadRepository)
    private facultadRepository: FacultadRepository,
    private historialService: HistorialService,
  ) {}

  // async paginate(
  //   options: PaginationOptionsInterface,
  // ): Promise<Pagination<User>> {
  //   const skippedItems = (options.page - 1) * options.limit;

  //   if (!options.status) {
  //     const [results, total] = await this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.roles', 'roles')
  //       .leftJoinAndSelect('user.facultad', 'facultad')
  //       .leftJoinAndSelect('facultad.localidad', 'localidad')
  //       .leftJoinAndSelect('user.proveedor', 'proveedor')
  //       .where('user.nombres LIKE :name ', {
  //         name: '%' + options.keyword + '%',
  //       })
  //       .orWhere('user.cedula LIKE :cedula', {
  //         cedula: '%' + options.keyword + '%',
  //       })

  //       .orderBy('user.nombres', 'ASC')
  //       .offset(skippedItems)
  //       .limit(options.limit)
  //       .getManyAndCount();

  //     return new Pagination<User>({
  //       results,
  //       total,
  //     });
  //   }

  //   if (options.keyword) {
  //     const total = await this.userRepository
  //       .createQueryBuilder('user')
  //       .where('user.status = :status', { status: options.status })
  //       .getCount();

  //     const results = await this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.roles', 'roles')
  //       .leftJoinAndSelect('user.facultad', 'facultad')
  //       .leftJoinAndSelect('facultad.localidad', 'localidad')
  //       .leftJoinAndSelect('user.proveedor', 'proveedor')
  //       .where('user.status = :status', { status: options.status })
  //       .andHaving('user.nombres LIKE :name ', {
  //         name: '%' + options.keyword + '%',
  //       })
  //       .orHaving('user.cedula LIKE :cedula', {
  //         cedula: '%' + options.keyword + '%',
  //       })
  //       .orderBy('user.nombres', 'ASC')
  //       .offset(skippedItems)
  //       .limit(options.limit)
  //       .getMany();

  //     return new Pagination<User>({
  //       results,
  //       total,
  //     });
  //   }

  //   const [results, total] = await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.roles', 'roles')
  //     .leftJoinAndSelect('user.facultad', 'facultad')
  //     .leftJoinAndSelect('facultad.localidad', 'localidad')
  //     .leftJoinAndSelect('user.proveedor', 'proveedor')
  //     .andWhere('user.status = :status', { status: options.status })
  //     .orderBy('user.nombres', 'ASC')
  //     .offset(skippedItems)
  //     .limit(options.limit)
  //     .getManyAndCount();

  //   return new Pagination<User>({
  //     results,
  //     total,
  //   });

  //   // TODO add more tests for paginate
  // }

  async paginate(status): Promise<User[]> {
    if (status) {
      const results = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.facultad', 'facultad')
        .leftJoinAndSelect('facultad.localidad', 'localidad')
        .leftJoinAndSelect('user.proveedor', 'proveedor')
        .andWhere('user.status = :status', { status })
        .orderBy('user.nombres', 'ASC')
        .getMany();

      return results;
    }
    const results = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.facultad', 'facultad')
      .leftJoinAndSelect('facultad.localidad', 'localidad')
      .leftJoinAndSelect('user.proveedor', 'proveedor')
      .orderBy('user.nombres', 'ASC')
      .getMany();

    return results;

    // TODO add more tests for paginate
  }

  async getUserAlls(filterDto: GetUserFilterDto): Promise<User[]> {
    return this.userRepository.getUserAlls(filterDto);
  }

  async getUserById(id: number, user: User) {
    const found: User = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new ConflictException(
        `El usuario con la cedula ${user.cedula} no se ha encontrado`,
      );
    }
    // if (user.cedula !== found.cedula && user.role !== Role.ADMIN_ROLE) {
    //   throw new UnauthorizedException();
    // }

    delete found.clave;
    const ultimo = await this.historialService.ultimoAcceso(found.id);
    const resp = {
      found,
      ultimo,
    };
    return resp;
  }

  async getUserTotal() {
    const afiliados = await this.userRepository.count({
      where: {
        status: 'ACTIVE',
      },
    });

    const proveedores = await this.userRepository.count({
      where: {
        status: 'PROVE',
      },
    });

    const todos = await this.userRepository.count();

    return { afiliados, proveedores, todos };
  }

  // --------------- CONSULTA TODOS EXCEL - CSV ---------------

  async generateUserAlls(res) {
    const user: User[] = await this.userRepository.find({
      select: [
        'cedula',
        'nombres',
        'celular',
        'telefono',
        'email',
        'emailPersonal',
        'facultad',
        'facultad',
        'fechaAfiliado',
      ],
      relations: ['facultad'],
      where: { status: 'ACTIVE' },
      order: {
        nombres: 'ASC',
      },
    });
    const userData = [];
    user.forEach(item => {
      userData.push({
        Cedula: item.cedula,
        Nombres: item.nombres,
        EmailInstitucional: item.email,
        EmailPersonal: item.emailPersonal,
        Cedular: item.celular,
        Telefono: item.telefono,
        Facultad: item.facultad.nombreFacultad,
        Extension: item.facultad.localidad.extension,
        Afiliado: item.fechaAfiliado,
      });
    });
    try {
      return res.send({ data: userData });
    } catch (err) {
      console.error(err);
    }
  }

  async generateUserFechaAlls(
    res,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<User[]> {
    const user: User[] = await this.userRepository.find({
      select: [
        'cedula',
        'nombres',
        'celular',
        'telefono',
        'email',
        'emailPersonal',
        'facultad',
        'fechaAfiliado',
      ],
      relations: ['facultad'],
      where: {
        status: 'ACTIVE',
        fechaAfiliado: Between(fechaInicio, fechaFin),
      },
      order: {
        fechaAfiliado: 'ASC',
      },
    });
    const userData = [];
    user.forEach(item => {
      userData.push({
        Cedula: item.cedula,
        Nombres: item.nombres,
        EmailInstitucional: item.email,
        EmailPersonal: item.emailPersonal,
        Cedular: item.celular,
        Telefono: item.telefono,
        Facultad: item.facultad.nombreFacultad,
        Extension: item.facultad.localidad.extension,
        Afiliado: item.fechaAfiliado,
      });
    });
    try {
      return res.send({ data: userData });
      // const csv = await jsonexport(userData, { rowDelimiter: ';' });
      // const pathName = `${uuid()}-user.csv`;
      // fs.writeFile(`upload/csv/${pathName}`, csv, 'utf8', function(err) {
      //   if (err) {
      //     console.log(
      //       'Some error occured - file either not saved or corrupted file saved.',
      //     );
      //   } else {
      //     return res.send({ file: pathName });
      //   }
      // });
    } catch (err) {
      console.error(err);
    }
  }

  // --------------------------------------------------------------

  async createUser(createUserDto: CreateUserDto, user: User) {
    return this.userRepository.createUser(createUserDto, user);
  }

  async createUserCsv(file) {
    return this.userRepository.createUserCsv(file);
  }

  async createUserCsvAlls(file) {
    return this.userRepository.createUserCsvAlls(file);
  }

  async createUserCsvInactive(file) {
    return this.userRepository.createUserCsvInactive(file);
  }

  // Metodo para actualizar un uausrio
  async updateUser(
    id: number,
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const { email, emailPersonal, celular, telefono, facultad } = updateUserDto;

    await this.getUserById(id, user);

    const founfFacultad = await this.facultadRepository.findOne({
      id: facultad,
    });
    if (!founfFacultad) {
      throw new ConflictException('La facultad no existe');
    }
    const userAdd = new User();
    userAdd.email = email;
    userAdd.emailPersonal = emailPersonal;
    userAdd.telefono = telefono;
    userAdd.celular = celular;
    userAdd.facultad = founfFacultad;

    try {
      await this.userRepository.update(id, userAdd);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Metodo para actualizar un usuario ADMIN
  async updateUserDetails(
    id: number,
    user: User,
    updateUserDetailsDto: UpdateUserDetailsDto,
  ): Promise<void> {
    const {
      cedula,
      nombres,
      email,
      emailPersonal,
      celular,
      telefono,
      facultad,
    } = updateUserDetailsDto;

    await this.getUserById(id, user);

    const userAdd = new User();
    userAdd.cedula = cedula;
    userAdd.nombres = nombres;
    userAdd.email = email;
    userAdd.emailPersonal = emailPersonal;
    userAdd.telefono = telefono;
    userAdd.celular = celular;
    userAdd.facultad = facultad;

    try {
      await this.userRepository.update(id, userAdd);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Metodo para actualizar el rol de usuarios SOLO ADMIN
  async updateRole(id: number, user: User, roleId: number): Promise<void> {
    const userExist = await this.userRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException('EL usuario no existe');
    }

    const roleExist = await this.roleRepository.findOne(roleId);

    if (!roleExist) {
      throw new ConflictException('Role does not exist');
    }

    const value = !!userExist.roles.find(item => item.role === roleExist.role);

    if (value) {
      throw new ConflictException('El usuario ya tiene asignado este rol');
    }

    userExist.roles.push(roleExist);

    await this.userRepository.save(userExist);
  }

  async deleteRole(id: number, user: User, roleId: number): Promise<void> {
    const userExist = await this.userRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException('EL usuario no existe');
    }

    const roleExist = await this.roleRepository.findOne(roleId);

    if (!roleExist) {
      throw new ConflictException('Role does not exist');
    }

    const value = userExist.roles.findIndex(
      item => item.role === roleExist.role,
    );

    if (value >= 0) {
      userExist.roles.splice(value, 1);
      await this.userRepository.save(userExist);
    }
  }

  //Metodo para actualizar la contraseña de usuario
  async updatePass(
    id: number,
    user: User,
    passUserDto: PassUserDto,
  ): Promise<void> {
    const { claveAnt, claveNue } = passUserDto;

    const found: User = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new ConflictException(
        `El usuario con la cedula ${id} no se ha encontrado`,
      );
    }
    // if (user.cedula !== found.cedula && user.role !== Role.ADMIN_ROLE) {
    //   throw new UnauthorizedException();
    // }

    if (!bcrypt.compareSync(claveAnt, found.clave)) {
      throw new ConflictException(`La contraseña antigua no coinciden`);
    }

    try {
      found.clave = await this.userRepository.hashPassword(claveNue, 6);
      found.save();
      await this.historialService.registrarAcceso(
        found.id,
        found.nombres,
        'CLAVE',
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Metodo para actualizar la contraseña de usuario ADMIN
  async updatePassAdmin(
    id: number,
    user: User,
    passUserAdminDto: PassUserAdminDto,
  ): Promise<void> {
    const { claveNue } = passUserAdminDto;

    const found: User = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(
        `El usuario con la cedula ${id} no se ha encontrado`,
      );
    }
    // if (user.cedula !== found.cedula && user.role !== Role.ADMIN_ROLE) {
    //   throw new UnauthorizedException();
    // }

    try {
      found.clave = await this.userRepository.hashPassword(claveNue, 6);
      found.save();
      await this.historialService.registrarAcceso(
        found.id,
        found.nombres,
        'CLAVE',
        user.nombres,
        user.id,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: number, status: string, user: User): Promise<User> {
    const userExist = await this.userRepository.findOne(id);

    if (!userExist) {
      throw new ConflictException();
    }

    if (status === 'ACTIVE') {
      await this.userRepository.update(id, {
        status: 'ACTIVE',
        fechaAfiliado: new Date(),
      });
      await this.historialService.registrarAcceso(
        userExist.id,
        userExist.nombres,
        'AFILIADO',
        user.nombres,
        user.id,
      );
    } else if (status === 'PROVE') {
      await this.userRepository.update(id, {
        status: 'PROVE',
        fechaAfiliado: new Date(),
      });
      await this.historialService.registrarAcceso(
        userExist.id,
        userExist.nombres,
        'AFILIADO',
        user.nombres,
        user.id,
      );
    } else {
      await this.userRepository.update(id, {
        status: 'INACTIVE',
        clave: await this.userRepository.hashPassword(userExist.cedula, 6),
        fechaDesafiliado: new Date(),
      });
      await this.historialService.registrarAcceso(
        userExist.id,
        userExist.nombres,
        'DESAFILIADO',
        user.nombres,
        user.id,
      );
    }
    return userExist;
  }
}
