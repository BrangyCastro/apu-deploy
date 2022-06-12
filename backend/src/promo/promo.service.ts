import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoRepository } from './promo.repository';
import { CreatePromoDto } from './dto/create-promo.dto';
import { Promo } from './promo.entity';
import * as fs from 'fs';
import * as moment from 'moment';
import 'moment/locale/es';
import { Cron } from '@nestjs/schedule';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';
import { MailService } from '../mail/mail.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { ProveedorRepository } from '../proveedor/proveedor.repository';
import { HistorialService } from 'src/historial/historial.service';
import { User } from '../user/user.entity';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoRepository)
    private promoRepository: PromoRepository,
    @InjectRepository(ProveedorRepository)
    private proveedorRepository: ProveedorRepository,
    private mailService: MailService,
    private historialService: HistorialService,
  ) {}

  private readonly logger = new Logger(PromoService.name);

  async getPromoById(
    getPromoFilterDto: GetPromoFilterDto,
  ): Promise<Promo[] | Promo> {
    return this.promoRepository.getPromoLimitId(getPromoFilterDto);
  }

  async getPromoAndUserById(id: number, user: User): Promise<Promo> {
    const found: Promo = await this.promoRepository
      .createQueryBuilder('promo')
      .leftJoinAndSelect('promo.proveedor', 'proveedor')
      .leftJoinAndSelect('proveedor.user', 'user')
      .where('promo.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!found) {
      throw new ConflictException(
        `El detalle de la promoción no se a encontrado`,
      );
    }

    return found;
  }

  async createPromo(
    createPromoDto: CreatePromoDto,
    user: User,
  ): Promise<Promo> {
    const {
      titulo,
      descripcion,
      proveedor,
      fechaInicio,
      fechaFin,
      status,
    } = createPromoDto;

    const promo = new Promo();
    promo.titulo = titulo;
    promo.descripcion = descripcion;
    promo.proveedor = proveedor;
    promo.fechaInicio = fechaInicio || null;
    promo.fechaFin = fechaFin || null;
    promo.status = status;

    try {
      const p = await promo.save();
      const prove = await this.proveedorRepository.findOne({
        where: { id: p.proveedor },
      });
      const rol = user.roles.filter(item => item.role === 'PROVE');
      if (rol.length > 0) {
        const fecha = moment(new Date()).format('LLL');
        await this.mailService.sendMailNewPromo(prove.nombre, fecha);
      }
      await this.historialService.registrarAcceso(
        p.id,
        prove.nombre,
        'PROMO_NEW',
        user.nombres,
        user.id,
      );
      return p;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al Guardar el usuario');
    }
    // return this.promoRepository.createPromo(createPromoDto);
  }

  async updatePhoto(id: number, name: string) {
    const found: Promo = await this.promoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      fs.unlinkSync(`./upload/promo/${name}`);
      throw new NotFoundException('La promo no existe');
    }
    try {
      await this.promoRepository.update(id, {
        url: name,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al subir la imagen.');
    }
  }

  async updatePromo(id: number, createPromoDto: CreatePromoDto): Promise<void> {
    const {
      titulo,
      descripcion,
      proveedor,
      fechaInicio,
      fechaFin,
      status,
    } = createPromoDto;

    const found: Promo = await this.promoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`La siguiente promo no existe.`);
    }

    const promo = new Promo();
    promo.titulo = titulo;
    promo.descripcion = descripcion;
    promo.proveedor = proveedor;
    promo.fechaInicio = fechaInicio || null;
    promo.fechaFin = fechaFin || null;
    promo.status = status;

    try {
      await this.promoRepository.update(id, promo);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deletePromo(id: number, status: boolean, user: User): Promise<void> {
    const found: Promo = await this.promoRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!found) {
      throw new NotFoundException(`La siguiente promo no existe.`);
    }

    if (status) {
      try {
        await this.promoRepository.delete({ id });
        await this.historialService.registrarAcceso(
          found.id,
          found.proveedor.nombre,
          'PROMO_DELETE',
          user.nombres,
          user.id,
        );
      } catch (error) {
        throw new NotFoundException(
          `Ocurrio un error al eliminar la promoción`,
        );
      }
    } else {
      try {
        await this.promoRepository.update(id, { status: 'ARCHIVADO' });
        await this.historialService.registrarAcceso(
          found.id,
          found.proveedor.nombre,
          'PROMO_FILE',
          user.nombres,
          user.id,
        );
      } catch (error) {
        throw new NotFoundException(
          `Ocurrio un error al eliminar la promoción`,
        );
      }
    }
  }

  // @Cron('0 0 7-23 * * *')
  handlePromoExpiration() {
    this.logger.debug('Llamado cuando el segundo actual es 45');
  }

  @Cron('0 0 7 * * *')
  async handleExample() {
    this.logger.debug('Verificando las promociones');
    const promo: Promo[] = await this.promoRepository.find();
    promo.map(async item => {
      if (item.fechaFin && item.status === 'PUBLICO') {
        if (item.fechaFin < new Date()) {
          await this.promoRepository.update(item.id, { status: 'FINALIZADO' });
          this.logger.debug(
            'Soy menor y debo cambiar al estado FINALIZADO ' + item.titulo,
          );
        }
      }
    });
  }
}
