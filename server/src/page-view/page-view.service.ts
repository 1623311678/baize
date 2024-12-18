import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageView } from './page-view.entity';

@Injectable()
export class PageViewService {
  constructor(
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  async update(pageViewDto: any) {
    const { url, userId = 'unKnow' } = pageViewDto;
    const pageView = await this.pageViewRepository.findOne({ where: { url } });
    if (pageView) {
      pageView.count += 1;
      pageView.userId = userId;
      const res = await this.pageViewRepository.save(pageView);
      return res;
    } else {
      const newPageView: any = this.pageViewRepository.create({
        url,
        count: 1,
        ...pageViewDto,
      });
      newPageView.userId = userId;
      const res = await this.pageViewRepository.save(newPageView);
      return res;
    }
    // const pageView = this.pageViewRepository.create(pageViewDto);
    // return this.pageViewRepository.save(pageView);
  }

  async getPageViews(
    url?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    if (url) {
      const pageView = await this.pageViewRepository.findOne({
        where: { url },
      });
      return pageView ? pageView.count : 0;
    } else {
      const [result, total] = await this.pageViewRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: result,
        total,
        page,
        limit,
      };
    }
  }
  async getUserDistribution(
    url: string,
  ): Promise<{ userId: string; count: number }[]> {
    return this.pageViewRepository
      .createQueryBuilder('page_view')
      .select('userId')
      .addSelect('COUNT(*)', 'count')
      .where('url = :url', { url })
      .groupBy('userId')
      .getRawMany();
  }
}
