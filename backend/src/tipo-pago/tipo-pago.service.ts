import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTipoPagoDto } from './dto/create.dto';
import { TipoPago } from './tipo-pago.entity';
import { TipoPagoRepository } from './tipo-pago.repository';

@Injectable()
export class TipoPagoService {
  constructor(
    @InjectRepository(TipoPagoRepository)
    private tipoPagoRepository: TipoPagoRepository,
  ) {}

  async getRolAlls(): Promise<TipoPago[]> {
    const rol: TipoPago[] = await this.tipoPagoRepository.find();
    return rol;
  }

  async create(createTipoPagoDto: CreateTipoPagoDto): Promise<boolean> {
    const { nombre, descripcion } = createTipoPagoDto;

    const tipoPago = new TipoPago();
    tipoPago.nombre = nombre;
    tipoPago.descripcion = descripcion;

    try {
      tipoPago.save();
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al Guardar el tipo de pago',
      );
    }
  }
}
