import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { Pagination, PaginationOptionsInterface } from '../paginate';
import { CreateMortuoriaDto } from './dto/create-mortuoria.dto';
import { PagosVarios } from './pagos_varios.entity';
import { PagosVariosRepository } from './pagos_varios.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { NewUser } from './new.user.entity';
import { TipoPagoRepository } from '../tipo-pago/tipo-pago.repository';

@Injectable()
export class PagosVariosService {
  constructor(
    @InjectRepository(PagosVariosRepository)
    private pagosVariosRepository: PagosVariosRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TipoPagoRepository)
    private tipoPagoRepository: TipoPagoRepository,
  ) {}

  async getPaginateMortuotia(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<PagosVarios>> {
    const skippedItems = (options.page - 1) * options.limit;
    if (options.keyword) {
      const total = await this.pagosVariosRepository
        .createQueryBuilder('mortuoria')
        .getCount();

      const results = await this.pagosVariosRepository
        .createQueryBuilder('mortuoria')
        .leftJoinAndSelect('mortuoria.user', 'user')
        .leftJoinAndSelect('mortuoria.tipo', 'tipo')
        .leftJoinAndSelect('mortuoria.details', 'details')
        .leftJoinAndSelect('user.facultad', 'facultad')
        .leftJoinAndSelect('facultad.localidad', 'localidad')
        .orderBy('mortuoria.createdAt', 'DESC')
        .andHaving('user.nombres LIKE :name ', {
          name: '%' + options.keyword + '%',
        })
        .offset(skippedItems)
        .limit(options.limit)
        .getMany();

      return new Pagination<PagosVarios>({
        results,
        total,
      });
    }

    const [results, total] = await this.pagosVariosRepository
      .createQueryBuilder('mortuoria')
      .leftJoinAndSelect('mortuoria.user', 'user')
      .leftJoinAndSelect('mortuoria.tipo', 'tipo')
      .leftJoinAndSelect('mortuoria.details', 'details')
      .leftJoinAndSelect('user.facultad', 'facultad')
      .leftJoinAndSelect('facultad.localidad', 'localidad')
      .orderBy('mortuoria.createdAt', 'DESC')
      .offset(skippedItems)
      .limit(options.limit)
      .getManyAndCount();

    return new Pagination<PagosVarios>({
      results,
      total,
    });
  }

  async getDate(dateStart: Date, dateEnd: Date): Promise<PagosVarios[]> {
    const found: PagosVarios[] = await this.pagosVariosRepository.find({
      where: {
        fecha: Between(dateStart, dateEnd),
      },
      order: {
        fecha: 'ASC',
      },
    });
    return found;
  }

  async generateMortuoriaAlls() {
    const found: PagosVarios[] = await this.pagosVariosRepository.find({
      order: {
        fecha: 'ASC',
      },
    });
    try {
      return found;
    } catch (err) {
      console.error(err);
    }
  }

  async createPagosVariosMortuoria(
    createMortuotiaDto: CreateMortuoriaDto,
    afiliado: boolean,
  ): Promise<void> {
    const {
      user,
      nCuenta,
      tipoCuenta,
      banco,
      concepto,
      fecha,
      valorPagar,
      valorAfiliado,
      nAfiliado,
      cedula,
      nombres,
      celular,
      telefono,
      correo,
      tipo,
    } = createMortuotiaDto;

    const found = await this.tipoPagoRepository.findOne({
      where: {
        id: tipo,
      },
    });

    if (!found) {
      throw new NotFoundException(`El tipo no existe`);
    }

    if (afiliado['afiliado'] === 'true') {
      const found: User = await this.userRepository.findOne({
        where: {
          id: user,
        },
      });

      if (!found) {
        throw new NotFoundException(`El usuario mo existe.`);
      }

      const pagosVarios = new PagosVarios();
      pagosVarios.user = user;
      pagosVarios.nCuenta = nCuenta;
      pagosVarios.tipoCuenta = tipoCuenta;
      pagosVarios.banco = banco;
      pagosVarios.concepto = concepto;
      pagosVarios.fecha = fecha;
      pagosVarios.valorPagar = valorPagar;
      pagosVarios.valorAfiliado = valorAfiliado;
      pagosVarios.nAfiliado = nAfiliado;
      pagosVarios.tipo = tipo;
      pagosVarios.details = null;

      try {
        await pagosVarios.save();
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error al Guardar el usuario');
      }
    } else {
      const userNew = new NewUser();
      userNew.cedula = cedula;
      userNew.nombres = nombres;
      userNew.celular = celular;
      userNew.telefono = telefono;
      userNew.correo = correo;

      const pagosVarios = new PagosVarios();
      pagosVarios.user = null;
      pagosVarios.nCuenta = nCuenta;
      pagosVarios.tipoCuenta = tipoCuenta;
      pagosVarios.banco = banco;
      pagosVarios.concepto = concepto;
      pagosVarios.fecha = fecha;
      pagosVarios.valorPagar = valorPagar;
      pagosVarios.valorAfiliado = valorAfiliado;
      pagosVarios.nAfiliado = nAfiliado;
      pagosVarios.tipo = tipo;
      pagosVarios.details = userNew;

      console.log(pagosVarios);
      try {
        await pagosVarios.save();
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error al Guardar el usuario');
      }
    }
  }

  async updateMortuoria(
    id: number,
    createMortuotiaDto: CreateMortuoriaDto,
  ): Promise<void> {
    const {
      user,
      nCuenta,
      tipoCuenta,
      banco,
      concepto,
      fecha,
      valorPagar,
      valorAfiliado,
      nAfiliado,
    } = createMortuotiaDto;
    const found: PagosVarios = await this.pagosVariosRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`No existe`);
    }

    const mortuoria = new PagosVarios();
    mortuoria.user = user;
    mortuoria.nCuenta = nCuenta;
    mortuoria.tipoCuenta = tipoCuenta;
    mortuoria.banco = banco;
    mortuoria.concepto = concepto;
    mortuoria.fecha = fecha;
    mortuoria.valorPagar = valorPagar;
    mortuoria.valorAfiliado = valorAfiliado;
    mortuoria.nAfiliado = nAfiliado;

    try {
      await this.pagosVariosRepository.update(id, mortuoria);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteMortuoria(id: number): Promise<void> {
    const found: PagosVarios = await this.pagosVariosRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!found) {
      throw new NotFoundException(`La siguiente promo no existe.`);
    }

    try {
      await this.pagosVariosRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
