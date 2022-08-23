import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Save } from './dto/save.dto';
import { UserEntity } from './user.entity';
import { FindOneOptions } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async save(data: Save): Promise<UserEntity> {
    return this.userRepository.save(this.userRepository.create(data));
  }

  async findAll() {
    const users = this.userRepository.find({
      select: ['id', 'username', 'email', 'age'],
    });

    const usersToJson = JSON.stringify(users);

    await this.cacheManager.set(usersToJson, { ttl: 60 });

    return users;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ id });

    const userToJson = JSON.stringify(user);

    await this.cacheManager.set(userToJson, { ttl: 60 });

    return user;
  }

  async findOneOrFail(options: FindOneOptions<UserEntity>) {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(data: Save, id: string): Promise<UserEntity> {
    const { username, email, password, age } = data;

    const user = await this.findById(id);

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;
    user.password = password ? password : user.password;
    user.age = age ? age : user.age;

    return this.userRepository.save(user);
  }

  async delete(id: string) {
    this.userRepository.delete(id);
  }
}
