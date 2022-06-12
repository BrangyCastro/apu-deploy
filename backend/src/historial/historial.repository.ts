import { Repository, EntityRepository } from 'typeorm';
import { Historial } from './historial.entity';

@EntityRepository(Historial)
export class HistorialRepository extends Repository<Historial> {}
