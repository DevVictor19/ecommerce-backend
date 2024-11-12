import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const AuthenticatedRoute = () => UseGuards(AuthGuard, RolesGuard);
