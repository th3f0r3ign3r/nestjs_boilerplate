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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/lib/dto';
import { ArraySerializeUser, serializeUser } from 'src/lib/types';
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
    return { response: ArraySerializeUser(await this.usersService.findAll()) };
  }

  @HttpCode(200)
  @Post('checkAvailability')
  async checkAvailability(
    @Body() payload: { uuid: ParseUUIDPipe; query: object },
  ) {
    return await this.usersService.checkAvailability(payload);
  }

  @Get(':uuid')
  async findByUuId(@Param('uuid', ParseUUIDPipe) uuid) {
    return {
      response: serializeUser(await this.usersService.findByUuid(uuid)),
    };
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  async remove(@Param('uuid', ParseUUIDPipe) uuid) {
    return await this.usersService.remove(uuid);
  }
}
