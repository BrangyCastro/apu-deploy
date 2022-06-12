import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Historial extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUser: number;

  @Column()
  nombreUser: string;

  @Column({ nullable: true })
  responsableId: number;

  @Column({ nullable: true })
  responsableNombre: string;

  @Column({ default: 'LOGIN' })
  type: string;

  @Column()
  fecha: Date;
}
