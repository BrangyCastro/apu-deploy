import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { VentaMes } from 'src/venta-mes/venta-mes.entity';
import { Promo } from 'src/promo/promo.entity';
import { Convenio } from 'src/convenio/convenio.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique(['nombre'])
export class Proveedor extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 150 })
  direccion: string;

  @Column({ type: 'text' })
  telefono: string;

  @Column({ type: 'varchar', length: 20 })
  numeroCuenta: string;

  @Column({ type: 'varchar' })
  razonSocial: string;

  @Column({ type: 'varchar', length: 30 })
  tipoCuenta: string;

  @Column({ type: 'varchar', length: 50 })
  banco: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  publico: boolean;

  @Column({ type: 'varchar', length: 150, default: '' })
  url: string;

  @OneToMany(
    type => VentaMes,
    ventaMes => ventaMes.id,
  )
  ventaMes: VentaMes[];

  @OneToMany(
    type => Promo,
    promo => promo.id,
  )
  promo: Promo[];

  @OneToMany(
    type => Convenio,
    convenio => convenio.proveedor,
  )
  convenio: Convenio[];

  @ManyToOne(
    type => User,
    user => user.proveedor,
    { eager: true },
  )
  user: User;

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;
}
