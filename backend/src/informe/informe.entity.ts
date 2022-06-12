import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Informe extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ type: 'varchar', default: '' })
  archivo: string;

  @Column({ type: 'varchar', default: 'PRIVADO', length: 7 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
