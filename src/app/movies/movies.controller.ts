import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
