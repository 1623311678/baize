import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

const exemptedRoutes = ['/api/users/register', '/api/auth/logout'];

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const route = request.route.path;

    // 豁免特定路由
    if (exemptedRoutes.includes(route)) {
      return true;
    }

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    if (this.tokenService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    try {
      await this.jwtService.verifyAsync(token);
      return true; // 验证成功
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
