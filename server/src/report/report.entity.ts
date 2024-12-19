import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column('text')
  stack: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  level: string;

  @Column()
  userAgent: string;

  @Column()
  timestamp: string;
}
