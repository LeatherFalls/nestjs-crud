import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Save } from './dto/save.dto';
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

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<object> {
    await this.userService.delete(id);
    return { message: 'user deleted' };
  }
}
