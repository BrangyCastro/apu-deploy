import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Ayuda } from 'src/ayuda/ayuda.entity';

@Entity()
export class AyudaCuota extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'int' })
  totalMeses: number;

  @Column({ type: 'int' })
  nCuota: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  valorCuota: number;

  @Column({ type: 'varchar', default: 'PROCESO', length: 8 })
  status: string;

  @ManyToOne(
    type => Ayuda,
    ayuda => ayuda.id,
    { eager: true },
  )
  ayuda: Ayuda;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
