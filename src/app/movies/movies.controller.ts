import {
  Body,
  CacheKey,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Redis from 'ioredis';
import { BadRequest } from '../helper/swagger/badRequest.swagger';
import { NotFound } from '../helper/swagger/notFound.swagger';
import { UnauthorizedSwagger } from '../helper/swagger/unauthorized.swagger';
import { SaveMovie } from './dto/save.movie';
import { MoviesService } from './movies.service';
import { MoviesSwagger } from './swagger/movies.swagger';

interface idRequest {
  id: number;
}

@Controller('movies')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly redisClient: Redis,
  ) {}

  @ApiOperation({ summary: 'Creates movies' })
  @ApiResponse({
    status: 201,
    description: 'Movie created',
    type: MoviesSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Some field of the request is wrong',
    type: BadRequest,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @Post()
  async save(@Body() data: SaveMovie) {
    return this.moviesService.save(data);
  }

  @ApiOperation({ summary: 'Lists all movies' })
  @ApiResponse({
    status: 200,
    description: 'Lists movies',
    type: MoviesSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @Get()
  @CacheKey('movies')
  async findAll() {
    const result = await this.moviesService.findAll();

    const cacheResult = await this.redisClient.get(
      'movies',
      async (error, data) => {
        if (error) console.log(error);
        if (data != null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex('movies', 1, JSON.stringify(data));
        }
      },
    );

    if (JSON.parse(cacheResult) == null) return result;

    return cacheResult;
  }

  @ApiOperation({ summary: 'Lists movies by id' })
  @ApiResponse({
    status: 201,
    description: 'Movie created',
    type: MoviesSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
    type: NotFound,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @Get('/:id')
  @CacheKey('movie/:id')
  async findById(@Param() id: idRequest) {
    const result = await this.moviesService.findById(id.id);

    console.log(result);

    const cacheResult = await this.redisClient.get(
      'movie/:id',
      async (error, data) => {
        if (error) console.log(error);
        if (data !== null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex('movie/:id', 1, JSON.stringify(data));
        }
      },
    );

    if (cacheResult) return cacheResult;

    console.log(cacheResult);

    return result;
  }

  @ApiOperation({ summary: 'Updates movies' })
  @ApiResponse({
    status: 201,
    description: 'Movie created',
    type: MoviesSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
    type: NotFound,
  })
  @ApiResponse({
    status: 400,
    description: 'Some field of the request is wrong',
    type: BadRequest,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @Put('/:id')
  async update(@Param('id') id: number, @Body() data: SaveMovie) {
    const result = await this.moviesService.update(data, id);

    return result;
  }

  @ApiOperation({ summary: 'Deletes movies' })
  @ApiResponse({
    status: 201,
    description: 'Movie created',
    type: MoviesSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
    type: NotFound,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.moviesService.delete(id);
  }
}
