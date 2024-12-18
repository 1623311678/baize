import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // 应该使用环境变量来存储密钥
    });
  }

  async validate(payload: JwtPayload) {

    const user = await this.userService.findOne(
      payload.username || payload.userName,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
