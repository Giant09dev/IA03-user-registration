import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('register')
  async createUser(@Body() user: { email: string; password: string }) {
    return this.userService.createUser(user.email, user.password);
  }

  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    return this.userService.login(user.email, user.password);
  }
}
