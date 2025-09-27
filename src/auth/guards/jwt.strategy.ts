import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminuserService } from '../../adminuser/adminuser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private adminusersService: AdminuserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get('JWT_SECRET') as string,
        'base64',
      ).toString('utf-8'),
    });
  }

  async validate(payload: any) {
    const userData = await this.adminusersService.findOneById(payload.sub);

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...user } = userData;
    return user;
  }
}
