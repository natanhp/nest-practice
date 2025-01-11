import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseOjb = {
  statusCode: number;
  timeStamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const myResponseOjb: MyResponseOjb = {
      statusCode: 200,
      timeStamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponseOjb.statusCode = exception.getStatus();
      myResponseOjb.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseOjb.statusCode = 422;
      myResponseOjb.response = exception.message.replaceAll(/\/n/g, '');
    } else {
      myResponseOjb.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseOjb.response = 'Internal Server Error';
    }

    response.status(myResponseOjb.statusCode).json(myResponseOjb);
    this.logger.error(myResponseOjb.response, AllExceptionsFilter.name);
    super.catch(exception, host);
  }
}
