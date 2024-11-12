import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtProvider } from 'src/auth/application/providers/jwt-provider.contract';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtProvider: JwtProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new BadRequestException('Missing bearer token');
    }

    try {
      const payload = this.jwtProvider.validateToken(token);

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Please login again');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
