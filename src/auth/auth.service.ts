import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminuserService } from './../adminuser/adminuser.service';

import { UsersService } from './../users/users.service';
import { MessageContent } from 'src/constant/constant-message';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly adminUsersService: AdminuserService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(req, username: string, password: string): Promise<any> {
    const user = await this.adminUsersService.findOneBy(username);
    const role = req.body?.role;

    const checkUsername = this.checkEmailOrNumber(username);
    if (!user) {
      return {
        success: false,
        message: MessageContent.INVALID(checkUsername),
      };
    }
    if (role && user.roles !== role) {
      return {
        success: false,
        message: MessageContent.USER_DOESNT_EXIST(`User`),
      };
    }

    if (!password || !user.password) {
      return {
        success: false,
        message: MessageContent.USER_DOESNT_EXIST(`User`),
      };
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword)
      return {
        success: false,
        message: MessageContent.INVALID(`Password`),
      };

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      this.logger.debug(`Result: ${JSON.stringify(result)}`);
      return {
        success: true,
        message: MessageContent.LOGIN_SUCCESS,
        result,
      };
    }

    return {
      success: false,
      message: null,
    };
  }

  checkEmailOrNumber(field: any) {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    if (emailRegEx.test(field)) return 'Email';
    else if (!isNaN(field)) return 'mobile number';
    else return `User ID`;
  }

  login(user: any) {
    const payload = {
      sub: user.id,
    };

    const authResponse = {
      success: true,
      access_token: '',
      user,
    };

    authResponse.access_token = this.jwtService.sign(payload);

    return authResponse;
  }
}
