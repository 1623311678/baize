import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserView } from './user-view.entity';

@Injectable()
export class UserViewService {
  constructor(
    @InjectRepository(UserView)
    private readonly userViewRepository: Repository<UserView>,
  ) {}
  async getLastVisitDate(userId: string): Promise<string> {
    const lastVisit = await this.userViewRepository.findOne({
      where: { userId },
      order: { visitTime: 'DESC' },
    });
    return lastVisit ? lastVisit.visitTime.toISOString().split('T')[0] : null;
  }
  async updateLastVisitDate(userId: string): Promise<void> {
    // 更新用户的最后访问日期
    await this.userViewRepository.update({ userId }, { visitTime: new Date() });
  }
  async recordVisit(
    userId: string,
    pageUrl: string,
    ipAddress: string,
  ): Promise<void> {
    const userView = this.userViewRepository.create({
      userId,
      visitTime: new Date(),
      pageUrl,
      ipAddress,
    });
    await this.userViewRepository.save(userView);
  }

  async getDailyStatistics(date: Date): Promise<any> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const totalUV = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('COUNT(DISTINCT userView.userId)', 'uniqueVisitors')
      .where('userView.visitTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    const activePages = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('userView.pageUrl')
      .addSelect('COUNT(*)', 'visitCount')
      .where('userView.visitTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .groupBy('userView.pageUrl')
      .orderBy('visitCount', 'DESC')
      .getRawMany();

    const activeTimes = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('HOUR(userView.visitTime)', 'hour')
      .addSelect('COUNT(*)', 'visitCount')
      .where('userView.visitTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const ipAddresses = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('userView.ipAddress')
      .addSelect('COUNT(DISTINCT userView.userId)', 'uniqueVisitors')
      .where('userView.visitTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .groupBy('userView.ipAddress')
      .getRawMany();

    return {
      totalUV: totalUV.uniqueVisitors,
      activePages,
      activeTimes,
      ipAddresses,
    };
  }
  async getDailyUniqueVisitors(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('COUNT(DISTINCT userView.userId)', 'uniqueVisitors')
      .where('userView.visitTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    return result.uniqueVisitors;
  }
  async getDailyVisitorsList(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    // 查询每天的独立访客数量
    const queryBuilder = this.userViewRepository
      .createQueryBuilder('userView')
      .select('DATE(userView.visitTime)', 'visitDate')
      .addSelect('COUNT(DISTINCT userView.userId)', 'uniqueVisitors')
      .groupBy('visitDate')
      .orderBy('visitDate', 'DESC')
      .offset(offset)
      .limit(limit);

    const result = await queryBuilder.getRawMany();

    // 查询总记录数（不带分页）
    const totalQueryBuilder = this.userViewRepository
      .createQueryBuilder('userView')
      .select('DATE(userView.visitTime)', 'visitDate')
      .addSelect('COUNT(DISTINCT userView.userId)', 'uniqueVisitors')
      .groupBy('visitDate');

    const totalResult = await totalQueryBuilder.getRawMany();
    const total = totalResult.length;

    return {
      total,
      page,
      limit,
      data: result,
    };
  }
  // 获取指定天数内的活跃用户数量
  async getActiveUsers(days: number): Promise<number> {
    const dateAgo = new Date();
    dateAgo.setDate(dateAgo.getDate() - days);

    const activeUsers = await this.userViewRepository
      .createQueryBuilder('userView')
      .select('userId')
      .distinct(true)
      .where('visitTime >= :date', { date: dateAgo })
      .getCount();

    return activeUsers;
  }
}
