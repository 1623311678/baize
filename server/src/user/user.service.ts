import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  async findOneByUsername(userName: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { userName } });
  }
  async findOne(userName: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { userName } });
  }
  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.usersRepository.findOne({ where: { id } });
  }
  async create(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    return this.usersRepository.save(user);
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // 新增获取用户总数的方法
  async count(): Promise<number> {
    return this.usersRepository.count();
  }
}
