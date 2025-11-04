/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseRepository } from './repository/expense.repository';
import { Expense } from './entities/expense.entity';
import { apiResponse } from './../utils/response.utils';
import { MessageContent } from './../constant/constant-message';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  private readonly logger = new Logger(ExpenseService.name);
  constructor(private expenseRepository: ExpenseRepository) {}

  async create(bodyParams: CreateExpenseDto, res, requestedUser) {
    const userId = requestedUser?.user?.id as number;
    console.log(userId, bodyParams);

    try {
      //check user id exist or not if not throw error message
      if (!userId)
        return apiResponse(
          res,
          404,
          {},
          MessageContent.USER_DOESNT_EXIST(`User ID`),
        ) as unknown;

      // create expense for the user
      const result = await this.expenseRepository.createEntity({
        ...bodyParams,
        user: { id: userId },
        createdBy: userId,
      });

      return apiResponse(
        res,
        200,
        result,
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `Expense`,
          `Created`,
        ),
        true,
      );
    } catch (err) {
      this.logger.error(`Create expense error: ${JSON.stringify(err)}`);
      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(req, res): Promise<Expense[]> {
    const userId = req?.id as number;

    try {
      const data = await this.expenseRepository.findAll(
        {
          user: { id: userId } as any,
        },
        'createdAt',
        'DESC',
      );

      return apiResponse(
        res,
        200,
        data,
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(`List`, `Fetched`),
        true,
      );
    } catch (err) {
      this.logger.error(`findall expense error: ${JSON.stringify(err)}`);
      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number, req, res?) {
    const userId = req?.id as number;

    try {
      const expense = await this.expenseRepository.findById({
        id,
        user: { id: userId },
      });

      if (!expense) {
        if (res) {
          throw new NotFoundException('Expense not found');
        } else {
          return {
            success: false,
            message: `Expense not found`,
          };
        }
      }

      if (res) {
        return apiResponse(
          res,
          200,
          expense,
          MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
            `Expense item`,
            `fetched`,
          ),
          true,
        );
      } else {
        return {
          success: true,
          data: expense,
        };
      }
    } catch (err) {
      this.logger.error(`findOne expense error: ${JSON.stringify(err)}`);

      if (res) {
        return apiResponse(
          res,
          500,
          {},
          err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return {
          success: false,
          message: err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async update(id: number, data: UpdateExpenseDto, req, res): Promise<Expense> {
    const userId = req?.id as number;
    try {
      const result = (await this.findOne(id, req)) as any;

      if (result?.success) {
        const expense = result?.data as Expense;
        Object.assign(expense, data);
        await this.expenseRepository.updateEntity(id, {
          ...expense,
          updatedBy: userId,
        });
        return apiResponse(
          res,
          200,
          {},
          MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
            `Expense`,
            `updated`,
          ),
          true,
        );
      } else {
        return apiResponse(res, 500, {}, result?.message);
      }
    } catch (err) {
      this.logger.error(`Update expense error: ${JSON.stringify(err)}`);
      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, req, res) {
    const userId = req?.id as number;
    try {
      this.expenseRepository.softDeleteById(id, { updatedBy: userId });

      return apiResponse(
        res,
        200,
        {},
        MessageContent.CREATE_UPDATE_DELETE_FETCHED_SUCCESS(
          `Expense`,
          `Deleted`,
        ),
        true,
      );
    } catch (err) {
      this.logger.error(`Softdelete expense error: ${JSON.stringify(err)}`);
      return apiResponse(
        res,
        500,
        {},
        err?.message || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
