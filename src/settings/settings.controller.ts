import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Req,
  Response,
  Get,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({
    summary: `Update the settings value`,
    description: 'This API allows a logged-in user to update their settings.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Body() updateSettingDto: UpdateSettingDto,
    @Req() req,
    @Response() res: Response,
  ) {
    return this.settingsService.update(req.user, updateSettingDto, res);
  }

  @ApiOperation({
    summary: `Get user Settings`,
    description: 'Get the user settings by token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getSettings(@Req() req, @Response() res: Response) {
    return this.settingsService.getUserSetting(req, res);
  }
}
