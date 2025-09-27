import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { apiResponse } from './../utils/response.utils';
import { AdminuserService } from './../adminuser/adminuser.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { MessageContent } from 'src/constant/constant-message';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
    private readonly adminUserService: AdminuserService,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async update(user, updateSettingDto: UpdateSettingDto, response) {
    this.logger.verbose(`*** updatesetting function call ****`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const checkUser = await this.adminUserService.findOneById(user.id);
      if (!checkUser)
        return apiResponse(
          response,
          404,
          {},
          MessageContent.USER_DOESNT_EXIST('User'),
        );

      // update the data into settings table
      await queryRunner.manager.update(
        Setting,
        { id: checkUser.settings.id },
        {
          ...updateSettingDto,
          updatedBy: user.id,
        },
      );

      this.logger.debug(`Settings updated successfully`);

      await queryRunner.commitTransaction();

      return apiResponse(
        response,
        200,
        {},
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(`User`, `Updated`),
        true,
      );
    } catch (err) {
      this.logger.error(`Updat setting error: ${JSON.stringify(err)}`);
      await queryRunner.rollbackTransaction();

      return apiResponse(
        response,
        500,
        {},
        err || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async participantSetting(id: number, queryRunner?: QueryRunner) {
    try {
      const settingsValue = new Setting();
      settingsValue.createdBy = id;

      if (queryRunner) {
        return await queryRunner.manager.save(Setting, settingsValue);
      } else {
        return await this.dataSource.manager.save(Setting, settingsValue);
      }
    } catch (err) {
      this.logger.error(
        `participantSetting Error: ${JSON.stringify({
          message: err?.message || null,
          stack: err?.stack || null,
        })}`,
      );
      throw err;
    }
  }

  async getUserSetting(req, res) {
    try {
      const user = await this.usersService.findUserByCondition({
        id: req.user.id,
      });

      if (!user) {
        return apiResponse(
          res,
          404,
          {},
          MessageContent.USER_DOESNT_EXIST('User'),
        );
      }

      let settings = await this.settingsRepository.findOne({
        where: { id: user.settings.id },
      });

      if (!settings) {
        const newSettings = this.settingsRepository.create({
          createdBy: user.id,
        });

        settings = await this.settingsRepository.save(newSettings);

        await this.usersService.updateUserByCondition(user.id, {
          settings,
          createdBy: user.id,
        });
      }

      return apiResponse(
        res,
        200,
        { settings },
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `Settings`,
          `Fetched`,
        ),
        true,
      );
    } catch (err) {
      this.logger.error(`Error in getUserSetting: ${err.stack || err}`);
      return apiResponse(
        res,
        400,
        {},
        err.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
