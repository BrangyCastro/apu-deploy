import { User } from './../user/user.entity';
import { VentaMes } from '../venta-mes/venta-mes.entity';
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
export class ApuExtension extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'varchar' })
  descripcion: string;

  @OneToMany(
    type => VentaMes,
    ventaMes => ventaMes.id,
  )
  ventaMes: VentaMes;

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
