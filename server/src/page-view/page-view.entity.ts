import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PageView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;
  @Column('text')
  message: string;
  @Column('text')
  stack: string;

  @Column({ default: 0 })
  count: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  userAgent: string;
}
