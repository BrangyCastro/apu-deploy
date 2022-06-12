import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { AyudaCuota } from 'src/ayuda-cuota/ayuda-cuota.entity';

@Entity()
export class Ayuda extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  banco: string;

  @Column({ type: 'varchar' })
  tipoCuenta: string;

  @Column({ type: 'varchar' })
  nCuenta: string;

  @Column({ type: 'text' })
  concepto: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorDepositar: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorSolicitado: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  porcentaje: number;

  @Column({ type: 'int' })
  totalMeses: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorCuota: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  total: number;

  @Column({ type: 'date' })
  fechaEmision: Date;

  @Column({ type: 'varchar', default: 'PROCESO', length: 8 })
  status: string;

  @ManyToOne(
    type => User,
    user => user.id,
    { eager: true },
  )
  user: User;

  @OneToMany(
    type => AyudaCuota,
    ayudaCuota => ayudaCuota.id,
  )
  ayudaCuota: AyudaCuota[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
