import { Controller, Post, Body, Request, Get, Query } from '@nestjs/common';

import { UserViewService } from './user-view.service';

@Controller('user-view')
export class UserViewController {
  constructor(private readonly userViewService: UserViewService) {}

  @Post('record')
  async recordVisit(@Request() req, @Body() body: { pageUrl: string }) {
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log('req', req.user);
    const userId = req?.user?.userName;
    // 获取用户最后访问日期
    const lastVisitDate = await this.userViewService.getLastVisitDate(userId);
    const today = new Date().toISOString().split('T')[0]; // 获取当前日期的 YYYY-MM-DD 格式

    // 如果用户今天还没有访问过，则记录这次访问
    if (lastVisitDate !== today) {
      await this.userViewService.recordVisit(
        userId,
        body.pageUrl,
        ipAddress as string,
      );
      // 更新用户的最后访问日期
      await this.userViewService.updateLastVisitDate(userId);
    }

    return {
      code: 200,
      data: true,
    };
  }

  @Get('statistics')
  async getDailyStatistics(@Query('date') date: string) {
    const statistics = await this.userViewService.getDailyStatistics(
      new Date(date),
    );
    return {
      code: 200,
      data: statistics,
    };
  }
  @Get('daily-unique-visitors')
  async getDailyUniqueVisitors(@Query('date') date: string): Promise<any> {
    const parsedDate = new Date(date);

    const res = await this.userViewService.getDailyUniqueVisitors(parsedDate);
    return {
      code: 200,
      data: res,
    };
  }
  @Get('daily-visitors-list')
  async getVistorList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const res = await this.userViewService.getDailyVisitorsList(page, limit);
    return {
      code: 200,
      data: res,
    };
  }
  @Get('active-users')
  async getActiveUsers(
    @Query('days') days: number,
  ): Promise<{ code: number; data: number }> {
    const count = await this.userViewService.getActiveUsers(days);
    return {
      code: 200,
      data: count,
    };
  }
}
