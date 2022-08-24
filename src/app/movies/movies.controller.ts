import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';
import { SaveMovie } from './dto/save.movie';
import { MoviesService } from './movies.service';

@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly redisClient: Redis,
  ) {}

  @Post()
  async save(@Body() data: SaveMovie) {
    return this.moviesService.save(data);
  }

  @Get()
  @CacheKey('movies')
  @CacheTTL(60)
  async findAll() {
    const result = await this.moviesService.findAll();

    const cacheResult = await this.redisClient.get(
      'movies',
      async (error, data) => {
        if (error) console.log(error);
        if (data != null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex('movies', 20000, JSON.stringify(data));
        }
      },
    );

    if (JSON.parse(cacheResult) == null) return result;

    return cacheResult;
  }

  @Get(':id')
  @CacheKey(':id')
  @CacheTTL(60)
  async findById(id: string) {
    const result = await this.moviesService.findById(id);

    const cacheResult = await this.redisClient.get(
      ':id',
      async (error, data) => {
        if (error) console.log(error);
        if (data != null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex(':id', 20000, JSON.stringify(data));
        }
      },
    );

    if (JSON.parse(cacheResult) == null) return result;

    return cacheResult;
  }
}
