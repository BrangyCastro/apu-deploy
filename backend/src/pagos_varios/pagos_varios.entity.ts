import { User } from '../user/user.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { NewUser } from './new.user.entity';
import { TipoPago } from 'src/tipo-pago/tipo-pago.entity';

@Entity('pagos_varios')
export class PagosVarios extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  nCuenta: string;

  @Column({ default: '' })
  tipoCuenta: string;

  @Column({ default: '' })
  banco: string;

  @Column({ default: '' })
  concepto: string;

  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorPagar: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorAfiliado: string;

  @Column({ type: 'int' })
  nAfiliado: number;

  @ManyToOne(
    type => TipoPago,
    tipo => tipo.id,
    { eager: true },
  )
  tipo: TipoPago;

  @ManyToOne(
    type => User,
    user => user.id,
    { eager: true },
  )
  user: User;

  @OneToOne(type => NewUser, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'detail_id' })
  details: NewUser;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
