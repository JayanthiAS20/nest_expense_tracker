import { Controller, UseGuards } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Common')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // Note: write a common functionality here
}
