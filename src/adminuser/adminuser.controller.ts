/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { AdminuserService } from './adminuser.service';
import { CreateAdminuserDto } from './dto/create-adminuser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { RolesGuard } from './../auth/roles/roles.guard';
import { Roles } from './../auth/roles/roles.decorators';
import { RoleType } from './../constant/constant-datavalue';

@ApiTags('Admin User')
@Controller('adminuser')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.SUPER_ADMIN)
export class AdminuserController {
  constructor(private readonly adminuserService: AdminuserService) {}

  @ApiOperation({
    summary: 'Create a adminuser profile',
    description:
      'This API creates a new admin user with unique email, mobile, etc...',
  })
  @Post()
  create(
    @Body() createAdminuserDto: CreateAdminuserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.adminuserService.create(createAdminuserDto, res, req);
  }

  @ApiOperation({
    summary: `Delete the user details - soft delete`,
  })
  @Delete('/user/:id')
  async deleteUserDetails(@Param('id') userId: number, @Res() res, @Req() req) {
    return await this.adminuserService.deleteUserDetails(userId, res, req);
  }
}
