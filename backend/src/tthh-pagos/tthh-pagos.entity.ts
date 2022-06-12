import { Tthh } from '../tthh/tthh.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity()
export class TthhPagos extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  observacion: string;

  @Column({ type: 'date' })
  mesDescontar: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  total: string;

  @Column({ type: 'boolean', default: false })
  email: boolean;

  @Column({ type: 'varchar', default: 'PRIVADO', length: 15 })
  status: string;

  @ManyToOne(
    type => Tthh,
    tthh => tthh.id,
    { eager: true },
  )
  tthh: Tthh;
}
