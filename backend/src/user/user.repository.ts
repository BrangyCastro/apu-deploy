import { Repository, EntityRepository, getConnection, Not } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { genSalt } from 'bcryptjs';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PassUserDto } from './dto/pass-user.dto';
import { RolesRepository } from '../roles/roles.repository';
import { Roles } from '../roles/roles.entity';
import { RoleType } from '../roles/roletype.enum';
import { PassUserAdminDto } from './dto/pass-user-admin.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Metodo que me permite crear un usuario
  async createUser(createUserDto: CreateUserDto, user: User) {
    const {
      nombres,
      email,
      clave,
      cedula,
      facultad,
      rol,
      emailPersonal,
      telefono,
      celular,
    } = createUserDto;

    const userCreate = new User();
    userCreate.cedula = cedula;
    userCreate.nombres = nombres;
    userCreate.email = email || '';
    userCreate.emailPersonal = emailPersonal || '';
    userCreate.telefono = telefono || '';
    userCreate.celular = celular || '';
    const salt = await genSalt(10);
    userCreate.clave = await this.hashPassword(clave, salt);
    userCreate.facultad = facultad;
    userCreate.fechaAfiliado = new Date();

    const repo = await getConnection().getRepository(Roles);
    const defaultRole = await repo.findOne({
      where: { id: rol },
    });

    userCreate.roles = [defaultRole];

    if (defaultRole.id === 3) {
      userCreate.status = 'PROVE';
    }

    try {
      await userCreate.save();
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El usuario ya existe');
      } else {
        throw new InternalServerErrorException('Error al Guardar el usuario');
      }
    }
  }

  async createUserCsv(file) {
    const results = [];
    console.log(file);
    if (file) {
      // console.log(file.buffer);
      fs.createReadStream(`./upload/csv/${file.filename}`)
        .pipe(csv({ separator: ';' }))
        .on('data', data => {
          try {
            results.push(data);
          } catch (error) {
            console.log(error);
          }
        })
        .on('end', () => {
          console.log(results);
          // results.forEach(async data => {
          //   const userCreate = new User();
          //   userCreate.cedula = data.CEDULA;
          //   userCreate.nombres = data.NOMBRES;
          //   userCreate.email = data.EMAIL || '';
          //   const salt = await genSalt(10);
          //   userCreate.clave = await this.hashPassword(data.CEDULA, salt);
          //   userCreate.facultad = data.FACULTAD;

          //   const rolesRepository: RolesRepository = await getConnection().getRepository(
          //     Roles,
          //   );

          //   const defaultRole: Roles = await rolesRepository.findOne({
          //     where: { role: RoleType.GENERAL },
          //   });

          //   userCreate.roles = [defaultRole];

          //   try {
          //     await userCreate.save();
          //   } catch (error) {
          //     if (error.code === 'ER_DUP_ENTRY') {
          //       throw new ConflictException('El usuario ya existe');
          //     } else {
          //       console.log(error);
          //       throw new InternalServerErrorException(
          //         'Error al Guardar el usuario',
          //       );
          //     }
          //   }
          // });
        });
    }
  }

  async createUserCsvAlls(file) {
    const results = [];
    if (file) {
      // console.log(file.buffer);
      fs.createReadStream(`./upload/csv/${file.filename}`)
        .pipe(csv({ separator: ';' }))
        .on('data', data => {
          try {
            results.push(data);
          } catch (error) {
            console.log(error);
          }
        })
        .on('end', () => {
          results.forEach(async data => {
            // const found: User = await this.findOne({
            //   where: {
            //     cedula: data.CEDULA.replace('-', ''),
            //   },
            // });
            const userCreate = new User();
            userCreate.emailPersonal = data.EMAIL_PERSONAL;
            userCreate.celular = data.CELULAR;
            userCreate.telefono = data.TELEFONO;

            // if (found) {
            //   console.log(found.nombres);
            //   contador++;
            // }

            console.log(userCreate);

            try {
              await this.update(
                { cedula: data.CEDULA.replace('-', '') },
                userCreate,
              );
            } catch (error) {
              if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('El usuario ya existe');
              } else {
                console.log(error);
                throw new InternalServerErrorException(
                  'Error al Guardar el usuario',
                );
              }
            }
          });
        });
    }
  }

  async createUserCsvInactive(file) {
    const results = [];
    if (file) {
      fs.createReadStream(`./upload/csv/${file.filename}`)
        .pipe(csv({ separator: ';' }))
        .on('data', data => {
          try {
            results.push(data);
          } catch (error) {
            console.log(error);
          }
        })
        .on('end', () => {
          console.log(results);
          results.forEach(async data => {
            const found: User = await this.findOne({
              where: {
                cedula: data.CEDULA,
              },
            });

            if (!found) {
              const userCreate = new User();
              userCreate.cedula = data.CEDULA;
              userCreate.nombres = data.NOMBRES;
              userCreate.email = data.EMAIL || '';
              const salt = await genSalt(10);
              userCreate.clave = await this.hashPassword(data.CLAVE, salt);
              userCreate.facultad = data.FACULTAD;

              const rolesRepository: RolesRepository = await getConnection().getRepository(
                Roles,
              );

              const defaultRole: Roles = await rolesRepository.findOne({
                where: { role: RoleType.GENERAL },
              });

              userCreate.roles = [defaultRole];

              userCreate.status = 'INACTIVE';

              try {
                await userCreate.save();
              } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                  throw new ConflictException('El usuario ya existe');
                } else {
                  console.log(error);
                  throw new InternalServerErrorException(
                    'Error al Guardar el usuario',
                  );
                }
              }
            }
          });
        });
    }
  }

  async createUserCsvActive(file) {
    const results = [];
    const prueba = [];
    if (file) {
      fs.createReadStream(`./upload/csv/${file.filename}`)
        .pipe(csv({ separator: ';' }))
        .on('data', data => {
          try {
            results.push(data);
          } catch (error) {
            console.log(error);
          }
        })
        .on('end', () => {
          results.forEach(async data => {
            const found: User = await this.findOne({
              where: {
                cedula: data.CEDULA,
              },
            });

            if (found) {
              const userCreate = new User();
              userCreate.status = 'ACTIVE';
              try {
                await this.update(found.id, userCreate);
              } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                  throw new ConflictException('El usuario ya existe');
                } else {
                  console.log(error);
                  throw new InternalServerErrorException(
                    'Error al Guardar el usuario',
                  );
                }
              }
            } else {
              const userCreate = new User();
              userCreate.cedula = data.CEDULA;
              userCreate.nombres = data.NOMBRES;
              userCreate.email = data.EMAIL || '';
              const salt = await genSalt(10);
              userCreate.clave = await this.hashPassword(data.CLAVE, salt);
              userCreate.facultad = data.FACULTAD;

              const rolesRepository: RolesRepository = await getConnection().getRepository(
                Roles,
              );

              const defaultRole: Roles = await rolesRepository.findOne({
                where: { role: RoleType.GENERAL },
              });

              userCreate.roles = [defaultRole];

              try {
                await userCreate.save();
              } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                  throw new ConflictException('El usuario ya existe');
                } else {
                  console.log(error);
                  throw new InternalServerErrorException(
                    'Error al Guardar el usuario',
                  );
                }
              }
            }
          });
        });
    }
  }

  // metodo que me permite obtner todos los usuarios
  async getUserAlls(filterDto: GetUserFilterDto): Promise<User[]> {
    const { nombre, afiliados, noAfiliados, cedula, rol } = filterDto;

    console.log(rol);

    const query = await this.createQueryBuilder('user')
      .select([
        'user.nombres',
        'user.id',
        'user.cedula',
        'user.email',
        'user.status',
      ])
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.facultad', 'facultad')
      .leftJoinAndSelect('facultad.localidad', 'localidad')
      .orderBy('nombres', 'ASC');

    if (afiliados) {
      query.where('user.status = :status', { status: afiliados });
    }

    if (noAfiliados) {
      query.where('user.status = :status', { status: noAfiliados });
    }

    if (nombre) {
      const like = nombre.split(' ').join('%');
      query.where('user.nombres like :name', { name: `${like}%` });
      query.orWhere('user.cedula like :cedula', { cedula: `%${cedula}%` });
    }

    if (rol) {
      query.where('roles.role = :status', { status: rol });
    }

    try {
      //TODO:Eliminar la clave
      const users: User[] = await query.getMany();

      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Metodo que nos permite actualizar la contraseña de un usuario
  async updatePass(
    id: number,
    user: User,
    passUserDto: PassUserDto,
  ): Promise<void> {
    const { claveAnt, claveNue } = passUserDto;

    const found: User = await this.findOne({
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

    if (!bcrypt.compareSync(claveAnt, found.clave)) {
      throw new NotFoundException(`La contraseña antigua no coinciden`);
    }

    try {
      found.clave = await this.hashPassword(claveNue, 6);
      found.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Metodo que nos permite actualizar la contraseña de un usuario ADMIN
  async updatePassAdmin(
    id: number,
    user: User,
    passUserAdminDto: PassUserAdminDto,
  ): Promise<void> {
    const { claveNue } = passUserAdminDto;

    const found: User = await this.findOne({
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
      found.clave = await this.hashPassword(claveNue, 6);
      found.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { cedula, clave } = authCredentialsDto;
    // const user: User = await this.createQueryBuilder('user')
    //   .where('NOT user.status = "INACTIVE"')
    //   .andWhere('user.cedula = :cedula', { cedula })
    //   .leftJoinAndSelect('user.roles', 'roles')
    //   .getOne();

    const user: User = await this.findOne({
      where: {
        cedula,
        status: Not('INACTIVE'),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorectas');
    }

    const isMatch = await bcrypt.compare(clave, user.clave);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorectas');
    }

    return user;
  }

  async deleteUser(id: number, status: string) {
    const userExist = await this.findOne(id);

    if (!userExist) {
      throw new NotFoundException();
    }

    if (status === 'ACTIVE') {
      await this.update(id, { status: 'ACTIVE', fechaAfiliado: new Date() });
    } else {
      await this.update(id, {
        status: 'INACTIVE',
        clave: await this.hashPassword(userExist.cedula, 6),
        fechaDesafiliado: new Date(),
      });
    }
    return userExist;
  }

  async hashPassword(password: string, salt: number): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
