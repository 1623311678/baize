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

  @Column({ nullable: true })
  level: string;

  @Column({ type: 'int', nullable: true })
  loadTime: number; // 新增字段，记录页面加载时间

  @Column({ type: 'int', nullable: true })
  lcp: number; // Largest Contentful Paint

  @Column({ type: 'int', nullable: true })
  fcp: number; // First Contentful Paint
}
