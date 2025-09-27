/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User Service')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: `Create user profile`,
    description: 'Registers a new user and sends OTP to the mobile number.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.create(createUserDto, res);
  }
}
