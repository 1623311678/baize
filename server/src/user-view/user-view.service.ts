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
}
