import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class UserView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  visitTime: Date;

  @Column()
  ipAddress: string;

  @Column()
  pageUrl: string;
}
