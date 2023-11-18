import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from '@/lib/dto/user.dto';
import { PrismaUserSTCWOQuery } from '@/prisma/prisma.service';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AuthTokenGuard, RolesGuard } from '@/lib/guards';
import { ACCESS } from '@/lib/decorators';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ACCESS('ADMIN', 'OWNER')
  async findAll(@Query() query: PrismaUserSTCWOQuery): Promise<User[]> {
    return this.userService.findMany(query);
  }

  @Get(':id')
  @ACCESS('ADMIN', 'OWNER')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findUnique({ id: String(id) });
  }

  @Post()
  @ACCESS('ADMIN', 'OWNER')
  async create(@Body() payload: CreateUserDTO): Promise<User> {
    return this.userService.create(payload);
  }

  @Patch(':id')
  @ACCESS('ADMIN', 'OWNER')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDTO,
  ): Promise<User> {
    return this.userService.update({
      where: { id: String(id) },
      data: payload,
    });
  }

  @Delete(':id')
  @ACCESS('ADMIN', 'OWNER')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete({ id: String(id) });
  }
}
