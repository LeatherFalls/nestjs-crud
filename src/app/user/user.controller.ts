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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Redis from 'ioredis';
import { BadRequest } from '../helper/swagger/badRequest.swagger';
import { NotFound } from '../helper/swagger/notFound.swagger';
import { Save } from './dto/save.dto';
import { CreateUserSwagger } from './swagger/create.swagger';
import { FindUserSwagger } from './swagger/find.swagger';
import { UpdateUserSwagger } from './swagger/update.swagger';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisClient: Redis,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Some field of the request is wrong',
    type: BadRequest,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Creates users' })
  async save(@Body() data: Save) {
    return this.userService.save(data);
  }

  @ApiOperation({ summary: 'Lists all users' })
  @ApiResponse({
    status: 200,
    description: 'Listed users',
    type: FindUserSwagger,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @Get('/:id')
  async test(id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  /* @ApiResponse({
    status: 200,
    description: 'Listed user by id',
    type: FindUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFound,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Lists users by id' })
  @Get('/:id')
  @CacheKey('user/:id')
  @CacheTTL(60)
  async findById(id: string): Promise<UserEntity> {
    const result = await this.userService.findById(id);

    const cacheResult = await this.redisClient.get(
      'user/:id',
      async (error, data) => {
        if (error) console.log(error);
        if (data != null) {
          return JSON.parse(data);
        } else {
          return this.redisClient.setex(
            'user/:id',
            20000,
            JSON.stringify(data),
          );
        }
      },
    );

    if (JSON.parse(cacheResult) == null) return result;

    return JSON.parse(cacheResult);
  } */

  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UpdateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Some field of the request is wrong',
    type: BadRequest,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Updates users' })
  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: Save,
  ): Promise<UserEntity> {
    const result = await this.userService.update(data, id);

    return result;
  }

  @ApiResponse({
    status: 204,
    description: 'Deleted user',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFound,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Deletes users' })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.userService.delete(id);
  }
}
