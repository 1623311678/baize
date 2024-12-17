import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entitys/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), RedisModule], // 导入 RedisModule
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], // 确保导出 OrderService
})
export class OrderModule {}
