import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { SaveMovie } from './dto/save.movie';
import { MovieEntity } from './movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesRepository: Repository<MovieEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async save(data: SaveMovie): Promise<MovieEntity> {
    return this.moviesRepository.save(this.moviesRepository.create(data));
  }

  async findAll(): Promise<MovieEntity[]> {
    return this.moviesRepository.find();
  }

  async findById(id: string): Promise<MovieEntity> {
    const movie = this.moviesRepository.findOneBy({ id });

    const movieToJson = JSON.stringify(movie);

    await this.cacheManager.set(movieToJson, { ttl: 60 });

    return movie;
  }
}
