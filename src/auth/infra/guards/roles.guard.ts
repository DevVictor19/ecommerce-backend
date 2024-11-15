import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtPayload } from '@/auth/application/providers/jwt-provider.contract';
import { ROLE } from '@/users/domain/enums/role.enum';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const user: JwtPayload = request.user;

    const isAuthorized = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!isAuthorized) return false;

    return true;
  }
}
