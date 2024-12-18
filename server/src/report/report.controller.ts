import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  // 查询所有错误报告
  @Get()
  async getAllReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { data, total } = await this.reportService.findAll(page, limit);
    return {
      code: 200,
      data: {
        list: data,
        total,
      },
    };
  }
  @Post()
  async report(@Body() report: any) {
    return this.reportService.handleReport(report);
  }
}
