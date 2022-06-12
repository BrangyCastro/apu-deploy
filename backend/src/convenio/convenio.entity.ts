import { Proveedor } from '../proveedor/proveedor.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Convenio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', default: '' })
  archivo: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  descuento: number;

  @ManyToOne(
    type => Proveedor,
    proveedor => proveedor.convenio,
    { eager: true },
  )
  proveedor: Proveedor;

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;
}
