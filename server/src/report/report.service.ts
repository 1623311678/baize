import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}
  // 查询所有错误报告
  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
  }
  async handleReport(report: Partial<Report>) {
    console.log('Received error report:', report);
    // 将错误信息存储到数据库
    const reportPayload = this.reportRepository.create(report);
    await this.reportRepository.save(reportPayload);

    return { status: 'ok', code: 200 };
  }
}
