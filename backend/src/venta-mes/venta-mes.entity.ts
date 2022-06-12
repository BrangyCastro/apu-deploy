import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { ApuExtension } from '../apuextension/apuextension.entity';

@Entity()
export class VentaMes extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  codigo: string;

  @Column({ type: 'date', nullable: true })
  fechaEmision: Date;

  @Column({ type: 'varchar' })
  mesPago: string;

  @Column({ type: 'date' })
  mesDescontar: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalVenta: number;

  @Column({ type: 'int' })
  totalMeses: number;

  @Column({ type: 'int' })
  cuotaMeses: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorCuota: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorPendiente: number;

  @Column({ type: 'varchar' })
  producto: string;

  @Column({ type: 'varchar' })
  factura: string;

  @ManyToOne(
    type => Proveedor,
    proveedor => proveedor.id,
    { eager: true },
  )
  proveedor: Proveedor;

  @ManyToOne(
    type => ApuExtension,
    apuExtension => apuExtension.id,
    { eager: true },
  )
  apuExtension: ApuExtension;

  @ManyToOne(
    type => User,
    user => user.id,
    { eager: true, nullable: false },
  )
  user: User;

  @Column({ type: 'varchar', default: 'PENDIENTE', length: 15 })
  status: string;
}
