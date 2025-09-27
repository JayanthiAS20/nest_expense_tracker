import { Module } from '@nestjs/common';
import { AdminuserService } from './adminuser.service';
import { AdminuserController } from './adminuser.controller';
import { User } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './../settings/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Setting])],
  controllers: [AdminuserController],
  providers: [AdminuserService],
  exports: [AdminuserService],
})
export class AdminuserModule {}
