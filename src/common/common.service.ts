import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);

  constructor() {}

  // Note: Write a common service function here
}
