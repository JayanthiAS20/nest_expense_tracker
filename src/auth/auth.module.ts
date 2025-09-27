import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminuserModule } from './../adminuser/adminuser.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './guards/local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [AdminuserModule, PassportModule, forwardRef(() => UsersModule)],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
