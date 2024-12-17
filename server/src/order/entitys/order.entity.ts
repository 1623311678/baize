// order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column({ default: true })
  isActive: boolean;
}
