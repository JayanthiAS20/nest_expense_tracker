/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(req, username: string, password: string): Promise<any> {
    const user: any = await this.authService.validateUser(
      req,
      username,
      password,
    );

    if (!user.success && user.message == null) {
      throw new UnauthorizedException();
    }

    if (!user.success) throw new BadRequestException(user.message);
    return user.result;
  }
}
