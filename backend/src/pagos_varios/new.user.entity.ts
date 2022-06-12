import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('new_user')
export class NewUser extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cedula: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nombres: string;

  @Column({ type: 'varchar', nullable: true })
  celular: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  correo: string;
}
