import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';
import { Roles } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private roleRepository: RolesRepository,
  ) {}

  async getRolAlls(): Promise<Roles[]> {
    const rol: Roles[] = await this.roleRepository.find();
    return rol;
  }
}
