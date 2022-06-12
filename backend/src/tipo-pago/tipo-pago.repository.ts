import { Repository, EntityRepository } from 'typeorm';
import { TipoPago } from './tipo-pago.entity';

@EntityRepository(TipoPago)
export class TipoPagoRepository extends Repository<TipoPago> {}
