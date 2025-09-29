/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiResponse } from 'src/utils/response.utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleType } from 'src/constant/constant-datavalue';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorators';
import { MessageContent } from 'src/constant/constant-message';

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

  @ApiOperation({
    summary: `Get User profile details`,
    description: `Get user profile by token`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getUserProfile(@Res() res: Response, @Req() req) {
    const user = req?.user as any;

    if (!user) return apiResponse(res, 404, {}, `User Not found`);

    return apiResponse(
      res,
      200,
      req?.user,
      MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
        `UserData`,
        `Fetched`,
      ),
    );
  }

  @ApiOperation({
    summary: `Update the User Profile details`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.USER)
  @Put()
  async updateUserProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() req,
  ) {
    return await this.usersService.updateUserProfile(updateUserDto, res, req);
  }
}
