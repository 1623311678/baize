// redis.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client

  constructor() {
    this.client = new Redis({
      host: 'localhost', // Redis 服务器地址
      port: 6379, // Redis 端口
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
