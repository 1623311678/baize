import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  // 查询所有错误报告
  @Get()
  async getAllReports() {
    const list = await this.reportService.findAll();
    return {
      code: 200,
      data: list,
    };
  }
  @Post()
  async report(@Body() report: any) {
    return this.reportService.handleReport(report);
  }
}
