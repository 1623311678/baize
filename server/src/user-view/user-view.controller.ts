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
    await this.userViewService.recordVisit(
      userId,
      body.pageUrl,
      ipAddress as string,
    );
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
}
