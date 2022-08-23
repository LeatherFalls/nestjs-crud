import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';
import { Save } from './dto/save.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisClient: Redis,
  ) {}

  @Post()
  async save(@Body() data: Save) {
    return this.userService.save(data);
  }

  @Get()
  @CacheKey('user')
  @CacheTTL(60)
  async findAll() {
    const result = await this.userService.findAll();

    const cacheResult = await this.redisClient.get(
      'user',
      async (error, data) => {
        if (error) console.log(error);
        if (data != null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex('user', 20000, JSON.stringify(data));
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
    const result = await this.userService.findById(id);

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

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: Save,
  ): Promise<UserEntity> {
    const result = await this.userService.update(data, id);

    return result;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.userService.delete(id);
  }
}
