import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/users/domain/enums/role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);

export const AdminPermission = () => Roles(ROLE.ADMIN);

export const ClientPermission = () => Roles(ROLE.CLIENT, ROLE.ADMIN);
