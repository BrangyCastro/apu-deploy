import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  role: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @ManyToMany(
    type => User,
    user => user.roles,
  )
  @JoinColumn()
  users: User[];
}
