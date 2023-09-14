import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/lib/dto/user.dto';
import { PrismaQuery } from 'src/prisma/prima.service';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(@Query() query: PrismaQuery): Promise<User[]> {
    return this.userService.getUsers(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.getUser({ id: String(id) });
  }

  @Post()
  async create(@Body() payload: CreateUserDTO): Promise<User> {
    return this.userService.createUser(payload);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDTO,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id: String(id) },
      data: payload,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: String(id) });
  }
}
