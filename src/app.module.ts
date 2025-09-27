import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import dbconfig from './config/db.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AdminuserModule } from './adminuser/adminuser.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleAsyncOptions => {
        return dbconfig;
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: Buffer.from(
          configService.get('JWT_SECRET') as string,
          'base64',
        ).toString('utf-8'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_TTL', '3600s'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminuserModule,
    UsersModule,
    SettingsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
