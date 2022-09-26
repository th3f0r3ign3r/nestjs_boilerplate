import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/lib/dto';
import { ParseIdPipe } from 'src/lib/pipes';
import { UsersService } from './users.service';

@UseInterceptors(CacheInterceptor)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @HttpCode(200)
  @Post('checkAvailability')
  async checkAvailability(@Body() payload: { id: ParseIdPipe; query: object }) {
    return await this.usersService.checkAvailability(payload);
  }

  @Get(':id')
  async findById(@Param('id', ParseIdPipe) id) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id) {
    return await this.usersService.remove(id);
  }
}
