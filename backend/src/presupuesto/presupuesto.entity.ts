import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Presupuesto extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  titulo: string;

  @Column()
  observacion: string;

  @Column({ type: 'varchar', default: '' })
  archivo: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', default: 'PRIVADO', length: 7 })
  status: string;
}
