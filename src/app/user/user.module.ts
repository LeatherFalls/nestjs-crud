import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import Redis from 'ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, Redis],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
