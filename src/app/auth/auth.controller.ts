import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequest } from '../helper/swagger/badRequest.swagger';
import { NotFound } from '../helper/swagger/notFound.swagger';
import { AuthService } from './auth.service';
import { LoginSwagger } from './swagger/login.swagger';

@Controller('/login')
@ApiTags('Login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  @ApiResponse({
    status: 400,
    description: 'Some field of the request is wrong',
    type: BadRequest,
  })
  @ApiResponse({
    status: 200,
    description: 'Logged',
    type: LoginSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFound,
  })
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
