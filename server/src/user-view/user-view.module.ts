import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserView } from './user-view.entity';
import { UserViewService } from './user-view.service';
import { UserViewController } from './user-view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserView])],
  providers: [UserViewService],
  controllers: [UserViewController],
})
export class UserViewModule {}
