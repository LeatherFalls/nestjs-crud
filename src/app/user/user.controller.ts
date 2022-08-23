import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Save } from './dto/save.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async save(@Body() data: Save) {
    return this.userService.save(data);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findById(id: string) {
    return this.userService.findById(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Save,
  ): Promise<UserEntity> {
    const result = await this.userService.update(data, id);

    return result;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<object> {
    await this.userService.delete(id);
    return { message: 'user deleted' };
  }
}
