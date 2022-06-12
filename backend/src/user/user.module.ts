import { HistorialService } from './../historial/historial.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import * as config from 'config';
import { JwtStrategy } from './jwt.strategy';
import { RolesRepository } from '../roles/roles.repository';
import { HistorialRepository } from '..//historial/historial.repository';
import { FacultadRepository } from '../facultad/facultad.repository';
const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      RolesRepository,
      HistorialRepository,
      FacultadRepository,
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, JwtStrategy, HistorialService],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
