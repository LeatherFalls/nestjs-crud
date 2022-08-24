import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieEntity } from './movies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MoviesService, Redis],
  controllers: [MoviesController],
})
export class MoviesModule {}
