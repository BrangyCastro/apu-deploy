import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AyudaRepository } from './ayuda.repository';
import { Ayuda } from './ayuda.entity';
import { CreateAyudaDto } from './dto/create-ayuda.dto';
import { Pagination, PaginationOptionsInterface } from 'src/paginate';

@Injectable()
export class AyudaService {
  constructor(
    @InjectRepository(AyudaRepository)
    private ayudaRepository: AyudaRepository,
  ) {}

  async getAyudaPagination(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<Ayuda>> {
    const skippedItems = (options.page - 1) * options.limit;

    if (!options.status) {
      const [results, total] = await this.ayudaRepository
        .createQueryBuilder('ayuda')
        .innerJoinAndSelect('ayuda.user', 'user')
        .leftJoinAndSelect('user.facultad', 'facultad')
        .leftJoinAndSelect('facultad.localidad', 'localidad')
        .where('user.nombres LIKE :name ', {
          name: '%' + options.keyword + '%',
        })
        .orWhere('user.cedula LIKE :cedula', {
          cedula: '%' + options.keyword + '%',
        })
        .orderBy('ayuda.fechaEmision', 'DESC')
        .offset(skippedItems)
        .limit(options.limit)
        .getManyAndCount();

      return new Pagination<Ayuda>({
        results,
        total,
      });
    }

    if (options.keyword) {
      const total = await this.ayudaRepository
        .createQueryBuilder('ayuda')
        .where('ayuda.status = :status', { status: options.status })
        .getCount();

      const results = await this.ayudaRepository
        .createQueryBuilder('ayuda')
        .innerJoinAndSelect('ayuda.user', 'user')
        .leftJoinAndSelect('user.facultad', 'facultad')
        .leftJoinAndSelect('facultad.localidad', 'localidad')
        .where('ayuda.status = :status', { status: options.status })
        .andHaving('user.nombres LIKE :name ', {
          name: '%' + options.keyword + '%',
        })
        .orHaving('user.cedula LIKE :cedula', {
          cedula: '%' + options.keyword + '%',
        })
        .orderBy('ayuda.fechaEmision', 'DESC')
        .offset(skippedItems)
        .limit(options.limit)
        .getMany();

      return new Pagination<Ayuda>({
        results,
        total,
      });
    }

    const [results, total] = await this.ayudaRepository
      .createQueryBuilder('ayuda')
      .innerJoinAndSelect('ayuda.user', 'user')
      .leftJoinAndSelect('user.facultad', 'facultad')
      .leftJoinAndSelect('facultad.localidad', 'localidad')
      .andWhere('ayuda.status = :status', { status: options.status })
      .orderBy('ayuda.fechaEmision', 'DESC')
      .offset(skippedItems)
      .limit(options.limit)
      .getManyAndCount();

    return new Pagination<Ayuda>({
      results,
      total,
    });
  }

  async getAyudaId(userId: number): Promise<boolean> {
    const found: Ayuda = await this.ayudaRepository.findOne({
      where: {
        user: userId,
        status: 'PROCESO',
      },
    });

    if (found) {
      return true;
    }
    return false;
  }

  async createAyuda(createAyudaDto: CreateAyudaDto): Promise<Ayuda> {
    return this.ayudaRepository.createAyuda(createAyudaDto);
  }
}
