import { Controller, Get } from '@nestjs/common';
import { Roles } from './roles.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  getUserAlls(): Promise<Roles[]> {
    return this.rolesService.getRolAlls();
  }
}
