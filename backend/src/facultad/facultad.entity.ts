import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Localidad } from '../localidad/localidad.entity';
import { User } from '../user/user.entity';

@Entity()
export class Facultad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreFacultad: string;

  @OneToMany(
    type => User,
    user => user.facultad,
  )
  user: User;

  @ManyToOne(
    type => Localidad,
    localidad => localidad.facultad,
    { eager: true },
  )
  localidad: Localidad;
}
