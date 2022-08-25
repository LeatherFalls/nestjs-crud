import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { SaveMovie } from './dto/save.movie';
import { MovieEntity } from './movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesRepository: Repository<MovieEntity>,
  ) {}

  async save(data: SaveMovie): Promise<MovieEntity> {
    return this.moviesRepository.save(this.moviesRepository.create(data));
  }

  async findAll(): Promise<MovieEntity[]> {
    return this.moviesRepository.find();
  }

  async findOneOrFail(options: FindOneOptions<MovieEntity>) {
    try {
      return await this.moviesRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findById(id: number): Promise<MovieEntity> {
    const movie = this.moviesRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(data: SaveMovie, id: number) {
    const movie = await this.findOneOrFail({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    this.moviesRepository.merge(movie, data);

    const result = await this.moviesRepository.save(movie);

    return result;
  }

  async delete(id: number) {
    const movie = await this.findOneOrFail({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return await this.moviesRepository.delete(id);
  }
}
