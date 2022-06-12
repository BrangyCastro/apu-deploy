import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    console.log(roles);
    // if (user.role !== Role.ADMIN_ROLE) {
    //   return false;
    // }

    // if (user.role !== Role.USER_ROLE) {
    //   return false;
    // }

    // const hasRole = () =>
    //   user.role

    // return user && user.role && hasRole();
    return true;
  }
}
