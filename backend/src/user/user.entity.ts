import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Facultad } from '../facultad/facultad.entity';
import { Roles } from '../roles/roles.entity';
import { VentaMes } from '../venta-mes/venta-mes.entity';
import { Tthh } from '../tthh/tthh.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { Ayuda } from 'src/ayuda/ayuda.entity';
import { PagosVarios } from '../pagos_varios/pagos_varios.entity';

@Entity()
@Unique(['cedula'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cedula: string;

  @Column()
  nombres: string;

  @Column()
  telefono: string;

  @Column()
  celular: string;

  @Column()
  emailPersonal: string;

  @Column()
  email: string;

  @Column()
  clave: string;

  @Column({ type: 'date', nullable: true })
  fechaAfiliado: Date;

  @Column({ type: 'date', nullable: true })
  fechaDesafiliado: Date;

  @ManyToOne(
    type => Facultad,
    facultad => facultad.user,
    { eager: true },
  )
  facultad: Facultad;

  @ManyToMany(
    type => Roles,
    role => role.users,
    { eager: true },
  )
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @OneToMany(
    type => VentaMes,
    ventaMes => ventaMes.id,
  )
  ventaMes: VentaMes[];

  @OneToMany(
    type => PagosVarios,
    mortuoria => mortuoria.id,
  )
  mortuoria: PagosVarios[];

  @OneToMany(
    type => Tthh,
    tthh => tthh.id,
  )
  tthh: Tthh[];

  @OneToMany(
    type => Ayuda,
    ventaMes => ventaMes.id,
  )
  ayuda: Ayuda[];

  @OneToMany(
    type => Proveedor,
    proveedor => proveedor.user,
  )
  proveedor: Proveedor[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;
}
