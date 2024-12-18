import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageView } from './page-view.entity';
import { PageViewService } from './page-view.service';
import { PageViewController } from './page-view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageView])],
  providers: [PageViewService],
  controllers: [PageViewController],
})
export class PageViewModule {}
