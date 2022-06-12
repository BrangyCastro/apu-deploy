import { Proveedor } from '../proveedor/proveedor.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Promo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ default: '' })
  url: string;

  @ManyToOne(
    type => Proveedor,
    proveedor => proveedor.id,
    { eager: true },
  )
  proveedor: Proveedor;

  @Column({ type: 'datetime', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ type: 'varchar', default: 'PUBLICO', length: 15 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
