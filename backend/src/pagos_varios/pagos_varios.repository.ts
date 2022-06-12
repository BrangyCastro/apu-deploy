import { EntityRepository, Repository } from 'typeorm';
import { PagosVarios } from './pagos_varios.entity';

@EntityRepository(PagosVarios)
export class PagosVariosRepository extends Repository<PagosVarios> {}
