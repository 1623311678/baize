import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

import * as cors from 'cors';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
async function bootstrap() {
  const appHttp = await NestFactory.create(AppModule);

  // 使用cors中间件，允许所有来源和方法
  appHttp.use(
    cors({
      origin: '*', // 允许所有来源
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 允许所有HTTP方法
      credentials: true, // 如果需要允许携带凭证，设置为true
    }),
  );

  // 创建一个临时的应用实例来获取 ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configServiceIns = appContext.get(ConfigService);
  // http端口
  const httpPort = configServiceIns.get('ORDER_SERVICE_PORT_HTTP');
  // 设置全局路由前缀
  appHttp.setGlobalPrefix('api');
  // 增加请求体大小限制
  appHttp.use(bodyParser.json({ limit: '10mb' })); // JSON请求体限制
  appHttp.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // URL编码请求体限
  // JWT  全局守卫
  // 使用全局守卫
  const jwtAuthGuard = appHttp.get(JwtAuthGuard);
  appHttp.useGlobalGuards(jwtAuthGuard);
  await appHttp.listen(httpPort);

  // 微服务端口
  const microPort = configServiceIns.get('ORDER_SERVICE_PORT_MCRO');
  // 创建微服务实例
  const appMicro = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: microPort,
      },
    },
  );

  await appMicro.listen();
  console.log(`microservice is running on port http://localhost:${microPort}`);
  console.log(`HTTP server is running on: http://localhost:${httpPort}`);

  // 关闭临时的应用上下文
  await appContext.close();
}

bootstrap();
