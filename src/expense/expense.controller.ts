/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Expense Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.expenseService.create(createExpenseDto, res, req);
  }

  @Get()
  findAll(@Res() res: Response, @Req() req: Request) {
    return this.expenseService.findAll(req, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    return this.expenseService.findOne(+id, req, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.expenseService.update(+id, updateExpenseDto, req, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    return this.expenseService.remove(+id, req, res);
  }
}
