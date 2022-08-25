import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Save } from './dto/save.dto';
import { UserEntity } from './user.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(data: Save): Promise<UserEntity> {
    return this.userRepository.save(this.userRepository.create(data));
  }

  async findAll() {
    const users = this.userRepository.find({
      select: ['id', 'username', 'email', 'age'],
    });

    return users;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneOrFail(options: FindOneOptions<UserEntity>) {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(data: Save, id: number): Promise<UserEntity> {
    const user = await this.findOneOrFail({ where: { id } });

    this.userRepository.merge(user, data);

    const result = await this.userRepository.save(user);

    return result;
  }

  async delete(id: number) {
    this.userRepository.delete(id);
  }
}
