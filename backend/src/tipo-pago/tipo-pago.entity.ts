import { PagosVarios } from 'src/pagos_varios/pagos_varios.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TipoPago extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @OneToMany(
    type => PagosVarios,
    tipo => tipo.id,
  )
  tipo: PagosVarios[];
}
