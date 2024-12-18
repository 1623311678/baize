import { Controller, Post, Body, Get, Query, Request } from '@nestjs/common';
import { PageViewService } from './page-view.service';

@Controller('pv')
export class PageViewController {
  constructor(private readonly pageViewService: PageViewService) {}

  @Post()
  async update(@Request() req, @Body() pageViewDto: any) {
    const userId = req?.user?.userName;
    pageViewDto.userId = userId;
    return this.pageViewService.update(pageViewDto);
  }

  @Get('list')
  async getPageViews(
    @Query('url') url?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const { data, total } = await this.pageViewService.getPageViews(
      url,
      page,
      limit,
    );
    return {
      code: 200,
      data: {
        list: data,
        total,
      },
    };
  }

  @Get('distribution')
  async getUserDistribution(
    @Query('url') url: string,
  ): Promise<{ userId: string; count: number }[]> {
    return this.pageViewService.getUserDistribution(url);
  }
}
