import { Roles } from '../roles/roles.entity';
import { Facultad } from '../facultad/facultad.entity';

export interface JwtPayload {
  id: number;
  cedula: string;
  nombres: string;
  email: string;
  roles: Roles[];
  facultad: Facultad;
  status: string;
}
