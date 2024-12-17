import { Controller, Post, Request, Res, Req } from '@nestjs/common';
import { Response } from 'express'; // 确保从 express 导入
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      this.tokenService.addToBlacklist(token);
    }

    // 记录审计日志（伪代码）
    // auditLogger.log({ event: 'logout', userId: req.user.id, timestamp: new Date() });

    res.status(200).json({ message: 'Logout successful', code: 200 });
  }
}
