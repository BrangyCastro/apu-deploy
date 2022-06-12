import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtPayload } from '../jwt-payload.interface';
import { HistorialService } from '../../historial/historial.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private historialService: HistorialService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    const payload: JwtPayload = {
      id: user.id,
      cedula: user.cedula,
      nombres: user.nombres,
      email: user.email,
      roles: user.roles,
      facultad: user.facultad,
      status: user.status,
    };
    const accessToken = await this.jwtService.sign(payload);
    this.historialService.registrarAcceso(user.id, user.nombres, 'LOGIN');
    return { accessToken };
  }
}
