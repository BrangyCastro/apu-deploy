import { EntityRepository, Repository } from 'typeorm';
import { AyudaCuota } from './ayuda-cuota.entity';

@EntityRepository(AyudaCuota)
export class AyudaCuotaRepository extends Repository<AyudaCuota> {}
