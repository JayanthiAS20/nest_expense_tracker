/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAdminuserDto } from './dto/create-adminuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../users/entities/user.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Status } from './../constant/constant-datavalue';
import { apiResponse } from './../utils/response.utils';
import * as bcrypt from 'bcrypt';
import { Setting } from './../settings/entities/setting.entity';
import { MessageContent } from 'src/constant/constant-message';
import { ConfigService } from '@nestjs/config';
import { ApiResponseCommonMetadata } from '@nestjs/swagger';

@Injectable()
export class AdminuserService {
  private readonly logger = new Logger(AdminuserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description create a field officer/user
   * @param createAdminuserDto
   * @param res
   * @returns userdetails
   */
  async create(
    createAdminuserDto: CreateAdminuserDto,
    res: any,
    req: any,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userId = req?.user ? req?.user?.id : 1;
    try {
      // Check if the email already exists
      const existingEmail = await this.userRepository.findOneBy({
        email: createAdminuserDto.email,
        activeStatus: true,
      });
      if (existingEmail) {
        return apiResponse(
          res,
          400,
          {},
          MessageContent.USER_DOESNT_EXIST(`Admin user`),
        );
      }

      // Check if the mobile number already exists
      const existingMobile = await this.userRepository.findOneBy({
        mobile: createAdminuserDto.mobile,
        activeStatus: true,
      });
      if (existingMobile) {
        return apiResponse(
          res,
          400,
          {},
          MessageContent.MOBILE_NUMBER_ALREADY_EXIST,
        );
      }

      // Save raw password for email (before hashing)
      const rawPassword = createAdminuserDto.password;

      // Hash the password
      createAdminuserDto.password = await bcrypt.hash(rawPassword, 10);
      createAdminuserDto.createdBy = userId;

      // Create and save settings entry
      const settingsValue = new Setting();
      settingsValue.createdBy = userId;
      const savedSettings = await queryRunner.manager.save(settingsValue);

      // Create the new user object
      const newUser = this.userRepository.create({
        ...createAdminuserDto,
        roles: createAdminuserDto.roles,
        settings: savedSettings,
      });

      // Save the new user
      const savedUser = await queryRunner.manager.save(newUser);

      // Fetch user details with settings relation
      const userDetails = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['settings'],
      });

      await queryRunner.commitTransaction();

      return apiResponse(
        res,
        200,
        userDetails,
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `Admin User`,
          `Created`,
        ),
        true,
      );
    } catch (err) {
      this.logger.error(
        `Create adminuser function Error: ${JSON.stringify(err)}`,
      );

      await queryRunner.rollbackTransaction();

      return apiResponse(res, 400, {}, err || HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findOneBy(username: string) {
    const userResult = await this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: Status.ACTIVE })
      .where('user.activeStatus = :activeStatus', { activeStatus: true })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.email = :email', { email: username }).orWhere(
            'user.mobile = :mobile',
            { mobile: username },
          );
        }),
      )
      .getOne();
    return userResult;
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, activeStatus: true },
      relations: {
        settings: true,
      },
    });
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<void> {
    await this.userRepository.update({ id: id }, updateData);
  }

  async deleteUserDetails(userId, res, req) {
    try {
      //check the user if exist proceed else throw error messages
      const userData = await this.findOneById(userId);

      if (!userData) return apiResponse(res, 404, {}, `UserId not found`);

      await this.userRepository.update(
        { id: userId },
        { deletedAt: new Date(), activeStatus: false, updatedBy: req?.user },
      );

      return apiResponse(
        res,
        200,
        {},
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `User data`,
          `Deleted`,
        ),
      ) as ApiResponseCommonMetadata;
    } catch (err) {
      this.logger.error(`deleteUserDetails Error: ${JSON.stringify(err)}`);

      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
