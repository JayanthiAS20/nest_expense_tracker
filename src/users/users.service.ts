/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { apiResponse } from './../utils/response.utils';
import * as bcrypt from 'bcrypt';
import { Setting } from 'src/settings/entities/setting.entity';
import { LoginType } from 'src/constant/constant-datavalue';
import { MessageContent } from 'src/constant/constant-message';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UserRepository,
    private dataSource: DataSource,
  ) {}

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async deactivateUser(id: number) {
    await this.userRepository.softDeleteById(id);
  }

  async create(createUserDto: CreateUserDto, res: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if email or mobile already exist
      const [emailUser, mobileUser] = await Promise.all([
        createUserDto.email
          ? queryRunner.manager.findOne(User, {
              where: { email: createUserDto.email, activeStatus: true },
            })
          : null,

        createUserDto.mobile
          ? queryRunner.manager.findOne(User, {
              where: { mobile: createUserDto.mobile, activeStatus: true },
            })
          : null,
      ]);

      // check if mobileUser already exist or not if yes throw error messages
      if (mobileUser) {
        await queryRunner.rollbackTransaction();
        return apiResponse(
          res,
          400,
          {},
          MessageContent.USER_EXIST('mobile number'),
        );
      }

      // check if emailUser already exist or not if yes throw error messages
      if (emailUser) {
        if (!emailUser.isMobileVerified) {
          await this.userRepository.updateEntity(emailUser.id, {
            mobile: createUserDto.mobile,
          });

          if (!emailUser.email && createUserDto.email && mobileUser) {
            await this.userRepository.updateEntity(mobileUser?.id, {
              email: createUserDto.email,
            });
          }

          const signUpMethods: { type: LoginType; value: string }[] = [];

          if (createUserDto.mobile) {
            signUpMethods.push({
              type: LoginType.MOBILE,
              value: String(createUserDto.mobile),
            });
          }

          await queryRunner.rollbackTransaction();
          return apiResponse(res, 200, {}, 'Mobile number updated');
        }

        // If mobile is verified, throw existing user error as usual
        await queryRunner.rollbackTransaction();
        return apiResponse(res, 400, {}, MessageContent.USER_EXIST('email'));
      }

      // Hash password and set default values
      if (createUserDto.password)
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      // set default value to 1
      createUserDto.createdBy = 1;

      // Create and save user
      const newUser = queryRunner.manager.create(User, createUserDto);
      const savedUser = await queryRunner.manager.save(newUser);

      const signUpMethods: { type: LoginType; value: string }[] = [];

      if (savedUser.mobile) {
        signUpMethods.push({
          type: LoginType.MOBILE,
          value: String(savedUser.mobile),
        });
      }

      if (savedUser.email) {
        signUpMethods.push({ type: LoginType.EMAIL, value: savedUser.email });
      }

      // Create settings entry with createdBy as the saved user ID
      const settingsValue = new Setting();
      settingsValue.createdBy = savedUser.id;
      const savedSettings = await queryRunner.manager.save(settingsValue);

      // Update user `createdBy` field
      savedUser.settings = savedSettings;
      savedUser.createdBy = savedUser.id;

      await queryRunner.manager.save(savedUser);

      await queryRunner.commitTransaction();
      // Fetch updated user details with settings relation
      const userDetails = await queryRunner.manager.findOne(User, {
        where: { id: savedUser.id },
        relations: ['settings'],
      });

      return apiResponse(
        res,
        201,
        userDetails,
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS('User', 'Created'),
      );
    } catch (error) {
      this.logger.error(`Error creating user: ${error?.message}`);
      await queryRunner.rollbackTransaction();
      return apiResponse(res, 500, {}, 'Internal Server Error');
    } finally {
      await queryRunner.release();
    }
  }

  updateUserProfile(updateUserDto: UpdateUserDto, res: any, req: any) {
    try {
      const user = req?.user;

      if (!user) return apiResponse(res, 404, {}, `User Profile not found`);

      updateUserDto.updatedBy = user?.id;

      this.updateUserByCondition(user?.id, { ...updateUserDto });

      return apiResponse(
        res,
        200,
        {},
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `User Details`,
          `Updated`,
        ),
      );
    } catch (err) {
      this.logger.error(`Update User Profile Error: ${JSON.stringify(err)}`);

      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserByCondition(condition, update) {
    try {
      return await this.userRepository.updateEntity(condition, update);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserByCondition(condition: any) {
    try {
      const data = await this.userRepository.findOne({
        where: condition,
        relations: { settings: true },
      });

      if (!data) return false;

      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
