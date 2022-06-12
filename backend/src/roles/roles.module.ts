import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolesRepository])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
