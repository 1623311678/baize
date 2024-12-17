import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis/redis.service'; // 确保路径正确
import { Repository } from 'typeorm';
import { Order } from './entitys/order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private configService: ConfigService,
    private redisService: RedisService, // 注入 RedisService
  ) {}

  getDatabaseCredentials() {
    const user = this.configService.get<string>('ORDER_DB_USER');
    const pass = this.configService.get<string>('ORDER_DB_PASS');
    return { user, pass };
  }
  create(orderData: Partial<Order>): Promise<Order> {
    const order = this.ordersRepository.create(orderData);
    return this.ordersRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOneBy({ id });
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.ordersRepository.update(id, orderData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async createOrder() {
    const orderId = `order_${Date.now()}`; // 示例订单ID
    const orderData = {
      /* 订单数据 */
    };

    // 将订单存储在 Redis 中
    await this.redisService.set(orderId, JSON.stringify(orderData));

    return `Order ${orderId} created successfully!`;
  }

  async getOrder(id: string) {
    // 从 Redis 中获取订单
    const orderData = await this.redisService.get(id);

    if (orderData) {
      return `Order data: ${orderData}`;
    } else {
      return `Order with ID ${id} not found.`;
    }
  }
  async insertInitialData() {
    const initialOrders = [
      { product: 'Product A', price: 99.99, quantity: 10, isActive: true },
      { product: 'Product B', price: 49.99, quantity: 5, isActive: true },
      { product: 'Product C', price: 19.99, quantity: 20, isActive: false },
    ];

    await this.ordersRepository.save(initialOrders);
  }
}
