import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { OrderService } from './order.service';
import { Order } from './entitys/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() orderData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }

  @Post()
  createOrder() {
    return this.orderService.createOrder();
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }
}
