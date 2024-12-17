import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(200)
  async create(@Body() user: User): Promise<any> {
    const existingUser = await this.userService.findOneByUsername(
      user.userName,
    );
    if (existingUser) {
      // 登录逻辑：验证密码
      const isPasswordValid = await bcrypt.compare(
        user.password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        return {
          code: 400,
          success: false,
          message: '用户名或者密码不正确',
        };
      }
      const token = await this.authService.generateToken(existingUser);
      return {
        code: 200,
        success: true,
        message: 'User has created return useinfo',
        data: {
          ...existingUser,
          access_token: token,
        },
      };
    } else {
      const newUser = await this.userService.create(user);
      const token = await this.authService.generateToken(newUser);
      return {
        code: 200,
        success: true,
        message: 'User created successfully',
        data: {
          ...newUser,
          access_token: token,
        },
      };
    }
  }

  @Get()
  async findAll(): Promise<any> {
    const users = await this.userService.findAll();
    return {
      code: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<any> {
    const updatedUser = await this.userService.update(id, userData);
    return {
      code: 200,
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    await this.userService.remove(id);
    return {
      code: 200,
      success: true,
      message: 'User deleted successfully',
    };
  }
}
