import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AdminuserService } from './adminuser.service';
import { CreateAdminuserDto } from './dto/create-adminuser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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
  create(@Body() createAdminuserDto: CreateAdminuserDto, @Res() res: Response) {
    return this.adminuserService.create(createAdminuserDto, res);
  }
}
