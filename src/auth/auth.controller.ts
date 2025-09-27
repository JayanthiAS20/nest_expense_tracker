import {
  Body,
  Controller,
  HttpStatus,
  ParseArrayPipe,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { apiResponse } from './../utils/response.utils';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login using username(email/mobile) and password',
    description:
      'Allows users to log in using their email or mobile number along with their password.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Body() body: LoginUserDto, @Res() res: Response) {
    const apiresponse = this.authService.login(req.user);
    return apiResponse(
      res,
      HttpStatus.OK,
      apiresponse,
      'Logged in successfully!..',
      true,
    );
  }
}
