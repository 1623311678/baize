import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { RedisModule } from './order/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { OrderService } from './order/order.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { PageViewModule } from './page-view/page-view.module';
import { UserViewModule } from './user-view/user-view.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置模块在整个应用中全局可用
      envFilePath: path.resolve(
        process.cwd(),
        `.env.${process.env.NODE_ENV || 'development'}`,
      ),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'monitor',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 自动同步实体到数据库
    }),
    OrderModule,
    RedisModule,
    UserModule,
    AuthModule,
    ReportModule,
    PageViewModule,
    UserViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements OnModuleInit {
//   // constructor(private readonly orderService: OrderService) {}
//   // async onModuleInit() {
//   //   await this.orderService.insertInitialData();
//   // }
// }
