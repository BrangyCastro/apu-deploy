import { User } from './../user/user.entity';
import { TthhPagos } from '../tthh-pagos/tthh-pagos.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Double,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tthh extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  fechaPago: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  total: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  aporte: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalProveedor: string;

  // @Column({ type: 'decimal', precision: 8, scale: 2 })
  // diferencia: number;

  @Column({ type: 'text' })
  observacion: string;

  // @Column({ type: 'boolean', default: false })
  // email: boolean;

  @ManyToOne(
    type => User,
    user => user.id,
    { eager: true },
  )
  user: User;

  @OneToMany(
    type => TthhPagos,
    tthhPagos => tthhPagos.id,
  )
  tthhPagos: TthhPagos[];

  @Column({ type: 'varchar', default: 'PENDIENTE', length: 12 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
