import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Facultad } from '../facultad/facultad.entity';

@Entity()
export class Localidad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  extension: string;

  @OneToMany(
    type => Facultad,
    facultad => facultad.localidad,
  )
  facultad: Facultad;
}
